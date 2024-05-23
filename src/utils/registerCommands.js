const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = async (client, commands) => {
  if(!commands || commands.length == 0) return console.log("No commands to register")
  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) ${commands.length} commands.`);
  } catch (error) {
    console.error(error);
  }
}