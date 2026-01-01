// TODO -> Archive by transforming channel into a thread in the 'archives' channel

import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { archive } from "../../utils/archive.js";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
export const create = () => {
  const command = new SlashCommandBuilder()
    .setName("archive")
    .setDescription("Archive ce salon");
  return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
export const invoke = async (interaction: ChatInputCommandInteraction) => {
  console.log(
    `${interaction.user.username} used /archive on ${interaction.channel?.name}`
  );

  const allowedCategories = [
    process.env.CATEGORY_SORTIES,
    process.env.CATEGORY_SORTIES_PAS_RAPENTE,
    process.env.CATEGORY_COMPETITIONS,
    process.env.CATEGORY_EVENEMENTS,
  ];
  const channel = interaction.channel as TextChannel;
  if (!channel.parent || !allowedCategories.includes(channel.parent.name)) {
    return interaction.reply({
      content:
        "Seuls les salons sorties, évenements et compétitions peuvent être archivés !",
      ephemeral: true,
    });
  } else {
    archive(channel);
    await interaction.reply({ content: "Salon archivé !", ephemeral: true });
  }
};
