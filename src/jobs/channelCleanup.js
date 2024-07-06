const { archive } = require("../utils/archive.js");

async function channelCleanup(client) {
  console.log("===== starting scheduled channel cleanup =====");

  const allowedCategories = ["🪂 SORTIES", "🏃Sorties pas rapente"];
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const categories = guild.channels.cache.filter((channel) =>
    allowedCategories.includes(channel.name)
  );

  const allowed = /(\d{1,2})-(\d{1,2})/;

  // do nothing for these format for now, too risky
  const forbidden1 = /(\d{1,2})-(\d{1,2})-(\d{1,2})/; // 04-05-06
  const forbidden2 =
    /-(janvier|fevrier|mars|avril|mai|juin|juillet|septembre|octobre|novembre|decembre)-/; // 04-05-juin

  for (const category of categories.values()) {
    const today = new Date();
    const channels = category.children.cache;

    for (const channel of channels.values()) {
      const match = allowed.exec(channel.name);

      // if month is found as a string (e.g. "juin"), do nothing for now, too risky
      if (
        !match ||
        forbidden1.exec(channel.name) ||
        forbidden2.exec(channel.name)
      ) {
        console.log(`format invalide ${channel.name}`);
        continue;
      }

      // archive channel 24 hours after actual expiry date. E.g. 18-05-plop will be archived on 20-05 at 1am
      const channel_date = new Date(
        today.getFullYear(),
        parseInt(match[2]) - 1,
        parseInt(match[1]) + 2
      );

      if (today > channel_date) {
        console.log(`${channel.name} too old, archiving!`);
        await archive(channel);
      } else {
        console.log(`${channel.name} OK`);
      }
    }
  }
}

module.exports = { channelCleanup };
