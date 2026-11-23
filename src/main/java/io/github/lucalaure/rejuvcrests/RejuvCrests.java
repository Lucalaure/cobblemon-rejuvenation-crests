package io.github.lucalaure.rejuvcrests;

import com.cobblemon.mod.common.pokemon.helditem.CobblemonHeldItemManager;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup;
import net.minecraft.ChatFormatting;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Rarity;
import net.minecraft.world.item.TooltipFlag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class RejuvCrests implements ModInitializer {
    public static final String MOD_ID = "rejuvcrests";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    /** One entry of data/rejuvcrests/crests.json (written by scripts/import_rejuvenation.py). */
    public record CrestDef(String id, String showdownId, String rejuvId, List<String> species) {}

    private static final List<CrestItem> CRESTS = new ArrayList<>();

    public static List<CrestItem> crests() {
        return Collections.unmodifiableList(CRESTS);
    }

    public static ResourceLocation id(String path) {
        return ResourceLocation.fromNamespaceAndPath(MOD_ID, path);
    }

    /** Crafting base for every crest (see data/rejuvcrests/recipe). */
    public static Item BLANK_CREST;

    @Override
    public void onInitialize() {
        BLANK_CREST = Registry.register(BuiltInRegistries.ITEM, id("blank_crest"), new Item(new Item.Properties()) {
            @Override
            public void appendHoverText(ItemStack stack, TooltipContext context, List<Component> tooltip, TooltipFlag flag) {
                tooltip.add(Component.translatable(getDescriptionId() + ".desc").withStyle(ChatFormatting.GRAY));
            }
        });

        for (CrestDef def : loadDefs()) {
            CrestItem item = Registry.register(BuiltInRegistries.ITEM, id(def.id()),
                    new CrestItem(def, new Item.Properties().stacksTo(1).rarity(Rarity.RARE)));
            // Cobblemon only maps its own namespace to Showdown item ids automatically, so point each crest
            // at its script in data/rejuvcrests/held_items/<showdownId>.js.
            CobblemonHeldItemManager.INSTANCE.registerRemap(item, def.showdownId());
            CRESTS.add(item);
        }

        Registry.register(BuiltInRegistries.CREATIVE_MODE_TAB, id("crests"), FabricItemGroup.builder()
                .title(Component.translatable("itemGroup.rejuvcrests.crests"))
                .icon(() -> new ItemStack(BLANK_CREST))
                .displayItems((params, output) -> {
                    output.accept(BLANK_CREST);
                    CRESTS.forEach(output::accept);
                })
                .build());

        LOGGER.info("Registered {} Rejuvenation crests", CRESTS.size());
    }

    private static List<CrestDef> loadDefs() {
        String path = "/data/" + MOD_ID + "/crests.json";
        try (InputStream in = RejuvCrests.class.getResourceAsStream(path)) {
            if (in == null) throw new IllegalStateException("Missing " + path);
            return new Gson().fromJson(new InputStreamReader(in, StandardCharsets.UTF_8),
                    new TypeToken<List<CrestDef>>() {}.getType());
        } catch (Exception e) {
            throw new RuntimeException("Could not load crest list", e);
        }
    }
}
