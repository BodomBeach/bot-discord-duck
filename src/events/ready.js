import fs from 'fs';
import {serverStats} from '../jobs/serverStats.js';
import {channelCleanup} from '../jobs/channelCleanup.js';

const once = true;
const name = 'ready';

async function invoke(client) {

	// start regular jobs
	setInterval(() => {channelCleanup(client)}, process.env.CHANNEL_CLEANUP_INTERVAL || 3600000); // every hour
	setInterval(() => {serverStats(client)}, process.env.STATS_INTERVAL || 600000); // every 10 min

	const commands = fs
		.readdirSync('src/events/commands')
		.filter((file) => file.endsWith('.js'))
		.map((file) => file.slice(0, -3));

	const commandsArray = [];

	for (let command of commands) {
		const commandFile = await import(`./commands/${command}.js`);
		commandsArray.push(commandFile.create());
	}

	client.application.commands.set(commandsArray);

	console.log(`Successfully logged in as ${client.user.tag}!`);
}

export { once, name, invoke };
