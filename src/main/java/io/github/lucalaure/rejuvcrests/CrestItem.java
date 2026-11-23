package io.github.lucalaure.rejuvcrests;

import net.minecraft.ChatFormatting;
import net.minecraft.network.chat.Component;
import net.minecraft.network.chat.MutableComponent;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.TooltipFlag;

import java.util.List;

/** A held item whose battle effect lives in data/rejuvcrests/held_items/&lt;showdownId&gt;.js. */
public class CrestItem extends Item {
    private final RejuvCrests.CrestDef def;

    public CrestItem(RejuvCrests.CrestDef def, Properties properties) {
        super(properties);
        this.def = def;
    }

    public RejuvCrests.CrestDef def() {
        return def;
    }

    @Override
    public void appendHoverText(ItemStack stack, TooltipContext context, List<Component> tooltip, TooltipFlag flag) {
        MutableComponent holders = Component.empty();
        for (int i = 0; i < def.species().size(); i++) {
            if (i > 0) holders.append(", ");
            holders.append(Component.translatable("cobblemon.species." + def.species().get(i) + ".name"));
        }
        tooltip.add(Component.translatable("tooltip.rejuvcrests.holder", holders).withStyle(ChatFormatting.GOLD));
        tooltip.add(Component.translatable(getDescriptionId() + ".desc").withStyle(ChatFormatting.GRAY));
    }
}
