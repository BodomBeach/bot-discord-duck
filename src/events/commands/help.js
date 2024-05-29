const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { HelpMessage } = require('../../utils/helpMessage.js');

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
  const command = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche le guide d\`utilisation du discord')
  return command.toJSON();
};

const invoke = async (interaction) => {
  const message = await new HelpMessage(interaction.guild).execute()
  await interaction.reply({ content: message , ephemeral: true })
};

module.exports = { create, invoke };