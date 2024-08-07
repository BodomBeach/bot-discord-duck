const once = false;
const name = "channelCreate";

async function invoke(channel) {
  try {
    const guild = channel.guild;
    const allChannels = guild.channels.cache;

    // Check if the channel limit (500) is reached, with a margin of 2
    if (allChannels.size >= 498) {
      const oldestArchiveCategory = channel.guild.channels.cache
        .filter(
          (channel) =>
            channel.type === 4 &&
            channel.name.slice(0, 11).toLowerCase() === "📁archives_"
        )
        .last();

      if (oldestArchiveCategory) {
        const oldestChannel = oldestArchiveCategory.children.cache
          .sort((a, b) => a.position - b.position)
          .last();

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
  } catch (error) {
    console.log(error);
  }
  return;
}

module.exports = { once, name, invoke };
