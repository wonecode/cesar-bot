import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { pickRandomAdjectives } from './adjective-picker';

export const createAdjectiveButtons = () => {
  const adjectives = pickRandomAdjectives(3);

  const buttons = adjectives.map((adj, index) =>
    new ButtonBuilder()
      .setCustomId(`adjective_${index}`)
      .setLabel(adj)
      .setStyle(ButtonStyle.Primary),
  );

  const refreshButton = new ButtonBuilder()
    .setCustomId('refresh')
    .setLabel('Rafraîchir')
    .setStyle(ButtonStyle.Secondary);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    ...buttons,
    refreshButton,
  );
};
