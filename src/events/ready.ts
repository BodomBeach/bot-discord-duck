import fs from 'fs';
import { Client } from 'discord.js';
import cron from 'node-cron';
import axios from 'axios';
import { serverStats } from '../jobs/serverStats.js';
import { channelCleanup } from '../jobs/channelCleanup.js';
import { monthlyWeatherMessage } from '../jobs/monthlyWeatherMessage.js';
import registerCommands from '../utils/registerCommands.js';
import '../utils/initDb.js';
import type { Command } from '../types/index.js';
import { manageRoles } from '../jobs/manageRoles.js';

export const once = true;
export const name = 'ready';
const TIMEZONE = 'Europe/Paris';

export async function invoke(client: Client) {
  // Every hour at :00
  cron.schedule('0 * * * *', () => channelCleanup(client), { timezone: TIMEZONE });

  // Every day at midnight
  cron.schedule('0 0 * * *', () => manageRoles(client), { timezone: TIMEZONE });

  // Every 10 minutes
  cron.schedule('*/10 * * * *', () => serverStats(client), { timezone: TIMEZONE });

  // Monthly: 1st of month at 11:00 AM Paris time
  cron.schedule('0 11 1 * *', () => monthlyWeatherMessage(client), { timezone: TIMEZONE });

  // Healthcheck ping
  if (process.env.HEALTHCHECK_URL) {
    const ping = () => axios.get(process.env.HEALTHCHECK_URL!).catch(() => {});
    ping(); // Initial ping on startup
    setInterval(ping, 120_000);
  }

  const commands: ReturnType<Command['create']>[] = [];
  const commandFiles = fs.readdirSync('./src/events/commands').filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command: Command = await import(`./commands/${file.replace('.ts', '.js')}`);
    commands.push(command.create());
  }
  registerCommands(client, commands);

  console.log(`✓ Successfully logged to Discord as ${client.user?.tag}!`);
}
