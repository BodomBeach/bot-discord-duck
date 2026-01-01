import { GuildChannel, CategoryChannel, ChannelType } from 'discord.js';

export async function archive(channel: GuildChannel) {
  const archiveCategories = channel.guild.channels.cache.filter(
    (ch) =>
      ch.type === ChannelType.GuildCategory &&
      ch.name.slice(0, 11).toLowerCase() === "📁archives_"
  );
  const latestCategory = archiveCategories
    .sort(
      (a, b) => parseInt(a.name.split("_")[1]) - parseInt(b.name.split("_")[1])
    )
    .last() as CategoryChannel | undefined;

  if (latestCategory && latestCategory.children.cache.size < 50) {
    await channel.setParent(latestCategory);
    await (channel as any).setPosition(0);
  } else {
    // Create a new archive category
    const count = Math.max(
      ...archiveCategories.map((cat) => parseInt(cat.name.split("_")[1]))
    );
    let newCategory = await channel.guild.channels.create({
      name: `📁ARCHIVES_${count + 1}`,
      type: ChannelType.GuildCategory,
    });

    // Position this new category at the top
    const positions = archiveCategories
      .filter((x): x is CategoryChannel => 'position' in x)
      .map((x) => x.position);
    await newCategory.setPosition(Math.min(...positions));
    console.log(`Created new archive category ${newCategory.name}`);
    await channel.setParent(newCategory);
  }
}
