const fs = require('fs');
const { serverStats } = require('../jobs/serverStats.js');
const { channelCleanup } = require('../jobs/channelCleanup.js');
const registerCommands = require('../utils/registerCommands.js');

const once = true;
const name = 'ready';

async function invoke(client) {

  // start regular jobs
  setInterval(() => { channelCleanup(client) }, process.env.CHANNEL_CLEANUP_INTERVAL || 3600000); // every hour
  setInterval(() => { serverStats(client) }, process.env.STATS_INTERVAL || 600000); // every 10 min

  const commands = []
  const commandFiles = fs.readdirSync('./src/events/commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.create());
  }
  registerCommands(client, commands)

  console.log(`Successfully logged to Discord as ${client.user.tag}!`);

}

module.exports = { once, name, invoke };
