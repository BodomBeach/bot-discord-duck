import { GuildChannel } from 'discord.js';

export const once = false;
export const name = "channelCreate";

export async function invoke(channel: GuildChannel) {
  // Channel creation handling - cleanup is now handled by hourly channelCleanup job
  // This ensures overflow channels are cleaned up even if the bot goes down
  return;
}
