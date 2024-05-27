require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new Client with the Guilds intent
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

// Loading all events
const events = fs
  .readdirSync('src/events')
  .filter((file) => file.endsWith('.js'));

for (let event of events) {
  const eventFile = require(`./events/${event}`);

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
