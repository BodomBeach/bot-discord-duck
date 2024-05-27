// TODO -> Archive by transforming channel into a thread in the 'archives' channel

const { SlashCommandBuilder }  = require('discord.js');
const {archive} = require('../../utils/archive.js');

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
	const command = new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Archive ce salon (fonctionne uniquement sur les salons sorties/compétitions/événements)')
    return command.toJSON();
  };

  // Called by the interactionCreate event listener when the corresponding command is invoked
  const invoke = async (interaction) => {
    console.log(`${interaction.user.username} used /archive`);

    const allowedCategories = ['🪂 SORTIES', '🏃Sorties pas rapente', '🏆 Compétitions'];
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

module.exports = { create, invoke };
