import { TextChannel, Client } from 'discord.js';
import { createButtons } from '../components/monkey-generator/buttons';
import { createEmbed } from '../components/monkey-generator/embed';

export const getMembersCount = (client: Client) => {
  const guildId = '1314380138305163356';
  const guild = client.guilds.cache.get(guildId);

  if (guild) {
    const memberCount = guild.memberCount;

    client.user?.setPresence({
      activities: [
        {
          type: 3,
          name: `${memberCount} singes`,
          url: 'https://twitch.tv/wonezer',
        },
      ],
    });
  } else {
    console.log(`Le serveur avec l'ID ${guildId} n'a pas été trouvé.`);
  }
};

export const sendMessageWithEmbedAndButtons = async (
  client: Client,
  channelId: string,
) => {
  const channel = client.channels.cache.get(channelId) as TextChannel;

  if (!channel) {
    console.error(`Channel avec l'ID ${channelId} introuvable.`);
    return;
  }

  const buttons = createButtons();
  const embed = createEmbed();

  try {
    await channel.send({
      embeds: [embed],
      components: [buttons],
    });
    console.log('Message avec embed et boutons envoyé avec succès.');
  } catch (error) {
    console.error('Erreur lors de l’envoi du message :', error);
  }
};
