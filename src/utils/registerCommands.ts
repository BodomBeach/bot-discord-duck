import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

export default async function registerCommands(client: Client, commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]) {
  if (!commands || commands.length == 0) return console.log("No commands to register");
  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN!);
  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user!.id, process.env.GUILD_ID!),
      { body: commands },
    );

    console.log(`✓ Successfully reloaded application (/) ${commands.length} commands.`);
  } catch (error) {
    console.error(error);
  }
}
