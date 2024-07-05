// TODO -> Archive by transforming channel into a thread in the 'archives' channel
async function archive(channel) {
  const archiveCategories = channel.guild.channels.cache.filter(
    (channel) =>
      channel.type === 4 &&
      channel.name.slice(0, 11).toLowerCase() === "📁archives_"
  );
  const latestCategory = channel.guild.channels.cache
    .filter(
      (channel) =>
        channel.type === 4 &&
        channel.name.slice(0, 11).toLowerCase() === "📁archives_"
    )
    .sort((channel) => parseInt(channel.name.split("_")[1]))
    .last();

  if (latestCategory) {
    channel.setParent(latestCategory);
  } else {
    // creating a new archive folder
    const count = Math.max(
      ...archiveCategories.map((cat) => parseInt(cat.name.split("_")[1]))
    );
    latestCategory = await channel.guild.channels.create({
      name: `📁ARCHIVES_${count + 1}`,
      type: 4,
    });
    console.log("Created new archive latestCategory");
    channel.setParent(available_archive);
  }
}

module.exports = { archive };
