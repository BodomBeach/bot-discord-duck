const once = false;
const name = 'messageCreate';

async function invoke(interaction) {

  const welcomeChannel = interaction.guild.channels.cache.find(channel => channel.name === 'bienvenue');

  // Ignore messages from bots and super admin
  if (interaction.author.bot) return;
  if (interaction.author.username === 'duckparapente') return;

  // Delete any message that is not a /command in the welcome channel. This is the only way to allow only commands in this channel
  if (interaction.channel === welcomeChannel) {
    await interaction.delete();
  }
  return;
}

module.exports = { once, name, invoke };
