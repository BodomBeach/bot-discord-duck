import { Message } from 'discord.js';

export const once = false;
export const name = 'messageCreate';

export async function invoke(message: Message) {
  const welcomeChannel = message.guild?.channels.cache.find(channel => channel.name === process.env.CHANNEL_BIENVENUE);

  // Ignore messages from bots and super admin
  if (message.author.bot) return;
  if (message.author.username === 'duckparapente') return;

  // Delete any message that is not a /command in the welcome channel. This is the only way to allow only commands in this channel
  if (welcomeChannel && message.channel.id === welcomeChannel.id) {
    await message.delete();
  }
  return;
}
