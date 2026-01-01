import { Interaction, ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../types/index.js';

export const once = false;
export const name = 'interactionCreate';

export async function invoke(interaction: Interaction) {
  // Check if the interaction is a command and call the invoke method in the corresponding file
  if (interaction.isChatInputCommand()) {
    const command: Command = await import(`./commands/${interaction.commandName}.js`);
    await command.invoke(interaction as ChatInputCommandInteraction);
  }
}
