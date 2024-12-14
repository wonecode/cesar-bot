import { EmbedBuilder } from 'discord.js';

export const createEmbed = () => {
  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Deviens un singe')
    .setDescription(
      "Sélectionnes l'adjectif qui te correspond le mieux, et laisses moi cook la suite. Tu as aussi la possibilité de trouver ton adjectif et te renommer directement.",
    )
    .setFooter({ text: 'César' });
};
