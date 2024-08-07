// TODO -> Archive by transforming channel into a thread in the 'archives' channel
async function archive(channel) {
  const archiveCategories = channel.guild.channels.cache.filter(
    (channel) =>
      channel.type === 4 &&
      channel.name.slice(0, 11).toLowerCase() === "📁archives_"
  );
  const latestCategory = archiveCategories
    .filter((channel) => channel.children.cache.size < 50)
    .sort(
      (a, b) => parseInt(a.name.split("_")[1]) - parseInt(b.name.split("_")[1])
    )
    .last();

  if (latestCategory) {
    await channel.setParent(latestCategory);
  } else {
    // creating a new archive folder
    const count = Math.max(
      ...archiveCategories.map((cat) => parseInt(cat.name.split("_")[1]))
    );
    let newCategory = await channel.guild.channels.create({
      name: `📁ARCHIVES_${count + 1}`,
      type: 4,
    });
    console.log(`Created new archive category ${newCategory.name}`);
    await channel.setParent(newCategory);
  }
}

module.exports = { archive };
