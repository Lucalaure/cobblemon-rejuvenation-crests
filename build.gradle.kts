plugins {
    id("java")
    id("dev.architectury.loom") version ("1.9-SNAPSHOT")
    id("architectury-plugin") version ("3.4-SNAPSHOT")
    // Needed in dev so Loom remaps Cobblemon's Kotlin metadata (otherwise Cobblemon fails to start).
    kotlin("jvm") version "2.2.20"
}


val modVersion = property("mod_version") as String

group = "io.github.lucalaure"
version = modVersion

base {
    archivesName.set("rejuvenation-crests-fabric")
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(21))
    withSourcesJar()
}

architectury {
    platformSetupLoomIde()
    fabric()
}

loom {
    silentMojangMappingsLicense()
}

repositories {
    mavenCentral()
    maven("https://maven.impactdev.net/repository/development/")
    maven("https://oss.sonatype.org/content/repositories/snapshots")
}

// Cobblemon's battle engine needs ICU, which Minecraft only ships with the client; without it runServer hangs.
val devServerLibs = tasks.register<Copy>("devServerLibs") {
    from(configurations.detachedConfiguration(project.dependencies.create("com.ibm.icu:icu4j:73.2")).apply { isTransitive = false })
    into(layout.buildDirectory.dir("devServerLibs"))
}

dependencies {
    minecraft("net.minecraft:minecraft:${property("minecraft_version")}")
    mappings(loom.officialMojangMappings())
    modImplementation("net.fabricmc:fabric-loader:${property("loader_version")}")
    modImplementation("net.fabricmc.fabric-api:fabric-api:${property("fabric_api_version")}")
    modImplementation("net.fabricmc:fabric-language-kotlin:${property("fabric_kotlin_version")}")
    modImplementation("com.cobblemon:fabric:${property("cobblemon_version")}")
    runtimeOnly(files(layout.buildDirectory.file("devServerLibs/icu4j-73.2.jar")).builtBy(devServerLibs))
}

tasks.processResources {
    inputs.property("version", project.version)
    filesMatching("fabric.mod.json") {
        expand("version" to project.version)
    }
}

tasks.withType<JavaCompile>().configureEach {
    options.encoding = "UTF-8"
    options.release.set(21)
}
