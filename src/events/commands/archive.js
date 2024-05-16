// TODO -> Archive by transforming channel into a thread in the 'archives' channel

import { SlashCommandBuilder } from 'discord.js';
import {archive, allowedCategories}from '../../utils/archive.js';

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
	const command = new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Archive ce salon')
	return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = async (interaction) => {
  console.log(`${interaction.user.username} used /archive`);

	if (!allowedCategories.includes(interaction.channel.parent.name)) {
		return interaction.reply({
			content: 'Seuls les salons sorties, évenements et compétitions peuvent être archivés !',
			ephemeral: true,
		});
	} else {
		archive(interaction.channel);
    await interaction.reply({ content: 'Salon archivé !', ephemeral: true });
	};
};

export { create, invoke };
