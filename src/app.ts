import 'dotenv/config';
import { validateEnv } from './utils/validateEnv.js';
import fs from 'fs';
import { Client, GatewayIntentBits } from 'discord.js';
import type { BotEvent } from './types/index.js';

// Verify all environment variables are defined before starting the bot
validateEnv();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

// Loading all events
const eventFiles = fs
  .readdirSync('src/events')
  .filter((file) => file.endsWith('.ts'));

for (const eventFile of eventFiles) {
  const event: BotEvent = await import(`./events/${eventFile.replace('.ts', '.js')}`);

  if (event.once)
    client.once(event.name, (...args) => {
      event.invoke(...args);
    });
  else
    client.on(event.name, (...args) => {
      event.invoke(...args);
    });
}

client.login(process.env.BOT_TOKEN);
