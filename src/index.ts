import { Client } from 'discord.js';
import { config } from './lib/config';
import { commands } from './commands';
import { deployCommands } from './lib/deploy-commands';
import { getMembersCount } from './lib/utils';
import {
  handleAdjectiveInteraction,
  sendAdjectiveMessage,
} from './components/monkey-generator/message-handler';

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'GuildPresences'],
});

client.once('ready', () => {
  getMembersCount(client);
  //sendAdjectiveMessage(client, '1317503136554029086');

  console.log('César bot is ready! 🤖');
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
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    const command = commands[commandName as keyof typeof commands];

    if (command && 'execute' in command) {
      command.execute(interaction);
    } else {
      console.error(`La commande ${commandName} n'a pas de méthode execute.`);
    }
  }

  if (interaction.isButton()) {
    handleAdjectiveInteraction(interaction);
    return;
  }
});

client.login(config.DISCORD_TOKEN);
