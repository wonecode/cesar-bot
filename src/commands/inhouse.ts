import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  TextChannel,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ComponentType,
  CacheType,
  Message,
} from 'discord.js';

const userRoles: Map<string, { displayName: string; role: string }> = new Map();

export const data = new SlashCommandBuilder()
  .setName('inhouse')
  .setDescription(
    'Permet de créer un évènement 5v5, les Inhouses de la Jungle.',
  )
  .addStringOption((option) =>
    option
      .setName('date')
      .setDescription('La date de la session respectant le format dd-MM-yyyy.')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('heure')
      .setDescription("L'heure de la session respectant le format HH:mm.")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Description de la session. (optionnel)'),
  );

async function updateEmbed(embed: EmbedBuilder, message: Message) {
  const roles = [
    { value: 'Top', icon: '1320072298283405313' },
    { value: 'Jungle', icon: '1320072528516878417' },
    { value: 'Mid', icon: '1320072456085442571' },
    { value: 'Bot', icon: '1320072382278271147' },
    { value: 'Support', icon: '1320072415681974393' },
    { value: 'Fill', icon: '1320072486590746725' },
  ];
  let userList = '';

  // Construire la liste des utilisateurs inscrits pour chaque rôle
  roles.forEach((role) => {
    const usersWithRole = Array.from(userRoles.values())
      .filter((entry) => entry.role === role.value)
      .map((entry) => `<:${role.value}:${role.icon}> ${entry.displayName}`);
    if (usersWithRole.length > 0) {
      userList += `${usersWithRole.join('\n')}\n`;
    }
  });

  if (!userList) userList = '*Aucun joueur inscrit pour le moment.*';

  const fields = embed.data.fields || [];

  fields[3].value = userList;
  fields[3].name = `📋 Joueurs inscrits (${userList.split('\n').length - 1})`;

  embed.setFields(fields);

  await message.edit({ embeds: [embed] });
}

export async function execute(interaction: CommandInteraction) {
  const sessionDate = interaction.options.get('date')?.value as string;
  const sessionHour = interaction.options.get('heure')?.value as string;
  const sessionDescription = interaction.options.get('description')
    ?.value as string;

  const targetChannelId = '1314987399427919926';

  const targetChannel = interaction.client.channels.cache.get(
    targetChannelId,
  ) as TextChannel;

  if (!targetChannel) {
    await interaction.reply({
      content: 'Le channel cible est introuvable.',
      ephemeral: true,
    });
    return;
  }

  const [day, month, year] = sessionDate.split('-').map(Number);
  const [hour, minute] = sessionHour.split(':').map(Number);

  const dateObject = new Date(year, month - 1, day, hour, minute);
  const timestamp = Math.floor(dateObject.getTime() / 1000);
  const now = new Date();
  const timeRemaining = dateObject.getTime() - now.getTime();

  if (isNaN(timestamp)) {
    await interaction.reply({
      content: 'La date ou l’heure saisie est invalide.',
      ephemeral: true,
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.displayName,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle(
      `<:palmier:1319723463685967935> SESSION INHOUSE DE LA JUNGLE <:palmier:1319723463685967935>`,
    )
    .setColor('#3FE7AB')
    .setDescription(sessionDescription || null)
    .addFields(
      {
        name: '\u200b',
        value: `📅 <t:${timestamp}:D>`,
        inline: true,
      },
      {
        name: '\u200b',
        value: `🕒 <t:${timestamp}:t>`,
        inline: true,
      },
      {
        name: '\u200b',
        value: `⌛ <t:${timestamp}:R>`,
        inline: true,
      },
      {
        name: '📋 Joueurs inscrits',
        value: `*Aucun joueur inscrit pour le moment.*`,
        inline: false,
      },
    )
    .setFooter({
      text: 'César',
      iconURL: 'https://i.ibb.co/mhmCHxp/tinywow-Cesar-71315583.jpg',
    })
    .setTimestamp();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('inhouse_roles')
    .setPlaceholder('Choisissez un rôle ou désinscrivez-vous')
    .addOptions(
      {
        label: 'Top',
        value: 'Top',
        emoji: { id: '1320072298283405313' },
      },
      {
        label: 'Jungle',
        value: 'Jungle',
        emoji: { id: '1320072528516878417' },
      },
      {
        label: 'Mid',
        value: 'Mid',
        emoji: { id: '1320072456085442571' },
      },
      {
        label: 'Bot',
        value: 'Bot',
        emoji: { id: '1320072382278271147' },
      },
      {
        label: 'Support',
        value: 'Support',
        emoji: { id: '1320072415681974393' },
      },
      {
        label: 'Fill',
        value: 'Fill',
        emoji: { id: '1320072486590746725' },
      },
      {
        label: 'Se désinscrire',
        value: 'Unsubscribe',
        emoji: { id: '1320178958142144595' },
      },
    );

  const actionRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  try {
    const message = await targetChannel.send({
      embeds: [embed],
      components: [actionRow],
      //content: '<@&1319693833151447082>',
    });

    await interaction.reply({
      content: 'Le post a bien été envoyé avec le menu d’inscription.',
      ephemeral: true,
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: timeRemaining,
    });

    collector.on(
      'collect',
      async (selectInteraction: StringSelectMenuInteraction<CacheType>) => {
        const userId = selectInteraction.user.id;
        const displayName = selectInteraction.user.displayName;
        const selectedRole = selectInteraction.values[0];

        if (selectedRole === 'Unsubscribe') {
          userRoles.delete(userId);
          console.log(`Utilisateur désinscrit: ${displayName}`);
          await selectInteraction.reply({
            content: 'Vous êtes désinscrit.',
            ephemeral: true,
          });
        } else {
          userRoles.set(userId, { displayName, role: selectedRole });
          console.log(
            `Utilisateur inscrit: ${displayName}, rôle: ${selectedRole}`,
          );
          await selectInteraction.reply({
            content: `Vous êtes inscrit avec le rôle **${selectedRole}**.`,
            ephemeral: true,
          });
        }

        await updateEmbed(embed, message);
      },
    );

    collector.on('end', async () => {
      actionRow.components[0].setDisabled(true);
      actionRow.components[0].setPlaceholder(
        'Les inscriptions à la session sont terminées.',
      );
      embed.setColor('#e74c3c');
      await message.edit({ embeds: [embed], components: [actionRow] });
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'embed :", error);
    await interaction.reply({
      content: "Une erreur est survenue lors de l'envoi de l'embed.",
      ephemeral: true,
    });
  }
}
