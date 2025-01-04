// This service update permissions on all channels programatically (doing it manually is time consuming and error prone)
// Basically, it just hide most channels to role "@everyone" (except a few channels) whereas all other roles can see everything

function updatePermissions(client) {
  const allowedChannels = ['👥bla-bla-parapente', 'bienvenue'];

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const channels = guild.channels.cache.filter(channel => !allowedChannels.includes(channel.name))
  // Fetch all channels in the guild

  channels.forEach(channel => {
    // Update the permissions for the @everyone role in each channel
    channel.permissionOverwrites.create(guild.roles.everyone, { ViewChannel: false });
    console.log(1);
  });

  console.log('Updated permissions');
}

module.exports = {updatePermissions}