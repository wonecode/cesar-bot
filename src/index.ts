import { Client } from "discord.js";
import { config } from "./utils/config";
import { commands } from "./commands";
import { deployCommands } from "./utils/deploy-commands";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
    console.log("Discord bot is ready! 🤖");
});

client.on("guildAvailable", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);