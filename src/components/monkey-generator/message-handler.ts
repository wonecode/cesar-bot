import { TextChannel, Client, Interaction, GuildMember } from 'discord.js';
import { createAdjectiveButtons } from './buttons';
import { createEmbed } from './embed';

const ROLE_PRIORITY = [
  { id: '1314380903136624693', name: 'Grands Singes', prefix: 'Singe' },
  { id: '1314986403473522819', name: 'Gorilles', prefix: 'Gorille' },
  { id: '1314579307225550898', name: 'Macaques Deluxe', prefix: 'Macaque' },
  { id: '1314986494787588137', name: 'Primates', prefix: 'Primate' },
];

export const handleAdjectiveInteraction = async (interaction: Interaction) => {
  if (!interaction.isButton()) return;

  const { customId, guild, user } = interaction;

  if (interaction.customId === 'refresh') {
    const buttons = createAdjectiveButtons();
    const embed = createEmbed();

    await interaction.update({
      embeds: [embed],
      components: [buttons],
    });
  }

  // Vérifie si l'interaction concerne un adjectif
  if (!customId.startsWith('adjective_')) return;

  // Extraire l'adjectif depuis le label du bouton
  const adjective = interaction.component?.label;
  if (!adjective) {
    await interaction.reply({
      content: 'Erreur : adjectif introuvable.',
      ephemeral: true,
    });
    return;
  }

  // Récupérer le membre correspondant à l'utilisateur
  const member = guild?.members.cache.get(user.id);
  if (!member) {
    await interaction.reply({
      content: 'Erreur : membre introuvable dans le serveur.',
      ephemeral: true,
    });
    return;
  }

  // Déterminer le rôle principal du membre
  const mainRole = getHighestRole(member);
  if (!mainRole) {
    await interaction.reply({
      content: 'Erreur : aucun rôle valide détecté.',
      ephemeral: true,
    });
    return;
  }

  // Renommer le membre
  const newNickname = `${mainRole.prefix} ${adjective}`;
  try {
    await member.setNickname(newNickname);
    await interaction.reply({
      content: `Ton pseudo a été changé en **${newNickname}**.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error('Erreur lors du renommage :', error);
    await interaction.reply({
      content: "Je n'ai pas la permission de te renommer.",
      ephemeral: true,
    });
  }
};

/**
 * Détermine le rôle le plus élevé d'un membre
 */
const getHighestRole = (member: GuildMember) => {
  const memberRoles = member.roles.cache;

  for (const role of ROLE_PRIORITY) {
    if (memberRoles.has(role.id)) {
      return role;
    }
  }

  return null;
};

export const sendAdjectiveMessage = async (
  client: Client,
  channelId: string,
) => {
  const channel = client.channels.cache.get(channelId) as TextChannel;

  if (!channel) {
    console.error(`Channel avec l'ID ${channelId} introuvable.`);
    return;
  }

  const buttons = createAdjectiveButtons();
  const embed = createEmbed();

  try {
    await channel.send({
      embeds: [embed],
      components: [buttons],
    });
    console.log('Message envoyé avec adjectifs dynamiques.');
  } catch (error) {
    console.error('Erreur lors de l’envoi du message :', error);
  }
};
