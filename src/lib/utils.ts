import { Client } from 'discord.js';

export const getMembersCount = (client: Client) => {
  const guildId = '1169671612879097906';
  const guild = client.guilds.cache.get(guildId);

  if (guild) {
    const memberCount = guild.memberCount;

    client.user?.setPresence({
      activities: [{ type: 3, name: `${memberCount} membres` }],
    });
  } else {
    console.log(`Le serveur avec l'ID ${guildId} n'a pas été trouvé.`);
  }
};
