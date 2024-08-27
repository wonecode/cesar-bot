import { Client } from 'discord.js';
import { config } from './lib/config';
import { commands } from './commands';
import { deployCommands } from './lib/deploy-commands';
import { getMembersCount } from './lib/utils';

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

client.once('ready', () => {
  getMembersCount(client);

  console.log('2R2T bot is ready! 🤖');
});

client.on('guildMemberAdd', () => {
  getMembersCount(client);
});

client.on('guildMemberRemove', () => {
  getMembersCount(client);
});

client.on('guildAvailable', async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
