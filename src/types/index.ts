import { ChatInputCommandInteraction, SlashCommandBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

export interface BotEvent {
  name: string;
  once?: boolean;
  invoke: (...args: any[]) => void | Promise<void>;
}

export interface Command {
  create: () => RESTPostAPIChatInputApplicationCommandsJSONBody;
  invoke: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
