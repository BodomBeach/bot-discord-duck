import fs from 'fs';
import { Client } from 'discord.js';
import { serverStats } from '../jobs/serverStats.js';
import { channelCleanup } from '../jobs/channelCleanup.js';
import registerCommands from '../utils/registerCommands.js';
import '../utils/initDb.js';
import type { Command } from '../types/index.js';
import { manageRoles } from '../jobs/manageRoles.js';

export const once = true;
export const name = 'ready';

export async function invoke(client: Client) {
  // start regular jobs
  setInterval(() => { channelCleanup(client) }, Number(process.env.CHANNEL_CLEANUP_INTERVAL) || 3600000); // every hour
  setInterval(() => { serverStats(client) }, Number(process.env.STATS_INTERVAL) || 600000); // every 10 min
  setInterval(() => { manageRoles(client) }, Number(process.env.MANAGE_ROLES_INTERVAL) || 3600000); // every hour

  const commands: ReturnType<Command['create']>[] = [];
  const commandFiles = fs.readdirSync('./src/events/commands').filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command: Command = await import(`./commands/${file.replace('.ts', '.js')}`);
    commands.push(command.create());
  }
  registerCommands(client, commands);

  console.log(`✓ Successfully logged to Discord as ${client.user?.tag}!`);
}
