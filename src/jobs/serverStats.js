const { EmbedBuilder } = require('discord.js');

async function serverStats(client) {
  console.log('===== starting scheduled server stats update =====');
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  // fetch members first, otherwise guild.roles.cache.get('1232623387965132820').members.size will be empty
  let members = await guild.members.fetch();
  const time = (new Date).toLocaleString(
    'fr-FR',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Europe/Paris',
    })

  const embed = new EmbedBuilder()
    .setTitle('Statistiques du serveur')
    .setColor(0x0099ff)
    .setThumbnail('https://cdn.discordapp.com/icons/943454897431523349/cadb5ff769c962489b5dd144acb1e2e3.webp?size=96')
    .setFooter({ text: `Dernière mise à jour : ${time}` })
    .addFields([
      {
        name: 'Membres total',
        value: guild.memberCount.toString(),
      },
      {
        name: 'Admins',
        value: guild.roles.cache.find(role => role.name === 'admins')?.members?.size?.toString() || '0',
        inline: true,
      },
      {
        name: 'Staff',
        value: guild.roles.cache.find(role => role.name === 'staff')?.members?.size?.toString() || '0',
        inline: true,
      },
      {
        name: 'Biplaceurs',
        value: guild.roles.cache.find(role => role.name === 'biplaceurs')?.members?.size?.toString() || '0',
        inline: true,
      },
      {
        name: 'Licencié 2025',
        value: guild.roles.cache.find(role => role.name === 'Licencié 2025')?.members?.size?.toString() || '0',
        inline: true,
      },
      {
        name: 'Nombre de salons',
        value: guild.channels.cache.size.toString(),
      },
    ]);

  const statsChannel = client.channels.cache.find(channel => channel.name === 'stats');
  let messages = await statsChannel.messages.fetch({ limit: 1 });

  // Create or edit existing embed
  if (messages.size === 0) {
    statsChannel.send({ embeds: [embed] });
  } else {
    messages.first().edit({ embeds: [embed] });
  };
  console.log('Server stats updated');
}

module.exports = { serverStats };