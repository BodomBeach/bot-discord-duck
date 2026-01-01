import { EmbedBuilder, Client, TextChannel } from "discord.js";

export async function serverStats(client: Client) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) return;

  // fetch members first, otherwise guild.roles.cache.get(id).members.size will be empty
  let members = await guild.members.fetch();
  const time = new Date().toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Europe/Paris",
  });

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const embed = new EmbedBuilder()
    .setTitle("Statistiques du serveur")
    .setColor(0x0099ff)
    .setThumbnail(
      "https://cdn.discordapp.com/icons/943454897431523349/cadb5ff769c962489b5dd144acb1e2e3.webp?size=96"
    )
    .setFooter({ text: `Dernière mise à jour : ${time}` })
    .addFields([
      {
        name: "Membres total",
        value: guild.memberCount.toString(),
      },
      {
        name: "Admins",
        value:
          guild.roles.cache
            .find((role) => role.name === process.env.ROLE_ADMINS)
            ?.members?.size?.toString() || "0",
        inline: true,
      },
      {
        name: "Staff",
        value:
          guild.roles.cache
            .find((role) => role.name === process.env.ROLE_STAFF)
            ?.members?.size?.toString() || "0",
        inline: true,
      },
      {
        name: "Biplaceurs",
        value:
          guild.roles.cache
            .find((role) => role.name === process.env.ROLE_BIPLACEURS)
            ?.members?.size?.toString() || "0",
        inline: true,
      },
      {
        name: `Licencié ${previousYear}`,
        value: guild.roles.cache.find(role => role.name === process.env.ROLE_LICENCIE_PREFIX + ' ' + previousYear)?.members?.size?.toString() || '0',
        inline: true,
      },
      {
        name: `Licencié ${currentYear}`,
        value: guild.roles.cache.find(role => role.name === process.env.ROLE_LICENCIE_PREFIX + ' ' + currentYear)?.members?.size?.toString() || '0',
        inline: true,
      },
      {
        name: 'Nombre de salons',
        value: guild.channels.cache.size.toString(),
      },
    ]);

  const statsChannel = client.channels.cache.find(
    (channel) => channel.isTextBased() && 'name' in channel && channel.name === "stats"
  ) as TextChannel | undefined;

  if (!statsChannel) return;

  let messages = await statsChannel.messages.fetch({ limit: 1 });

  // Create or edit existing embed
  if (messages.size === 0) {
    statsChannel.send({ embeds: [embed] });
  } else {
    messages.first()?.edit({ embeds: [embed] });
  }
}
