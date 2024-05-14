import { } from 'dotenv/config';
import fs from 'fs';
import { Client, GatewayIntentBits } from 'discord.js';

// Create a new Client with the Guilds intent
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Loading all events
const events = fs
	.readdirSync('src/events')
	.filter((file) => file.endsWith('.js'));

for (let event of events) {

	const eventFile = await import(`./events/${event}`);

	if (eventFile.once)
		client.once(eventFile.name, (...args) => {
			eventFile.invoke(...args);
		});
	else
		client.on(eventFile.name, (...args) => {
			eventFile.invoke(...args);
		});
};

client.login(process.env.BOT_TOKEN);
