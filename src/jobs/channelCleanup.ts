import { archive } from "../utils/archive.js";
import { Client, CategoryChannel, ChannelType, Guild } from "discord.js";


export async function channelCleanup(client: Client) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) return;

  await autoArchive(guild);
  await destroyOldestChannel(guild);
}

async function autoArchive(guild: Guild) {
  const allowedCategories = [process.env.CATEGORY_SORTIES, process.env.CATEGORY_SORTIES_PAS_RAPENTE];

  const categories = guild.channels.cache.filter((channel: any) =>
    allowedCategories.includes(channel.name)
  );

  let invalidChannelsCount = 0;

  const allowed = /(\d{1,2})-(\d{1,2})/;

  // do nothing for these format for now, too risky
  const forbidden1 = /(\d{1,2})-(\d{1,2})-(\d{1,2})/; // 04-05-06
  const forbidden2 =
    /-(janvier|fevrier|mars|avril|mai|juin|juillet|septembre|octobre|novembre|decembre)-/; // 04-05-juin

  for (const category of categories.values()) {
    const today = new Date();
    const channels = (category as CategoryChannel).children.cache;

    for (const channel of channels.values()) {
      const match = allowed.exec(channel.name);

      // if month is found as a string (e.g. "juin"), do nothing for now, too risky
      if (
        !match ||
        forbidden1.exec(channel.name) ||
        forbidden2.exec(channel.name)
      ) {
        invalidChannelsCount++;
        continue;
      }

      // archive channel 24 hours after actual expiry date. E.g. 18-05-plop will be archived on 20-05
      const channel_date = new Date(
        today.getFullYear(),
        parseInt(match[2]) - 1,
        parseInt(match[1]) + 2
      );

      if (today > channel_date) {
        console.log(`Archiving ${channel.name} (too old)`);
        await archive(channel);
      } 
    }
  }
}

async function destroyOldestChannel(guild: Guild) {
  // If too close to channel limit (500), destroy oldest archive
  const allChannels = guild.channels.cache;
  if (allChannels.size >= 138) {
    const oldestArchiveCategory = guild.channels.cache
      .filter(
        (ch: any) =>
          ch.type === ChannelType.GuildCategory &&
          ch.name.slice(0, 11).toLowerCase() === "📁archives_"
      )
      .sort(
        (a: any, b: any) =>
          parseInt(a.name.split("_")[1]) - parseInt(b.name.split("_")[1])
      )
      .first() as CategoryChannel | undefined;

    if (oldestArchiveCategory) {
      const oldestChannel = oldestArchiveCategory.children.cache
        .sort((a, b) => a.position - b.position)
        .last();

      if (oldestChannel) {
        console.log(
          `Making room - delete oldest archive channel ${oldestChannel.name}`
        );
        await oldestChannel.delete();

        // If the category is now empty, delete it
        if (oldestArchiveCategory.children.cache.size === 0) {
          // not zero because cache is not refreshed yet
          console.log(`Delete empty category ${oldestArchiveCategory.name}`);
          await oldestArchiveCategory.delete();
        }
      }
    }
  }
}
