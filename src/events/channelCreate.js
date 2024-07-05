const once = false;
const name = "channelCreate";

async function invoke(channel) {
  try {
    const guild = channel.guild;
    const allChannels = guild.channels.cache;

    // Check if the channel limit (500) is reached
    if ((allChannels.size > 498)) {
      const oldestArchiveCategory = channel.guild.channels.cache
        .filter(
          (channel) =>
            channel.type === 4 &&
            channel.name.slice(0, 11).toLowerCase() === "📁archives_"
        )
        .sort((channel) => parseInt(channel.name.split("_")[1]))
        .first();

      if (oldestArchiveCategory) {
        const oldestChannel = oldestArchiveCategory.children.cache
          .sort((channel) => channel.position)
          .first();

        console.log(
          `Making room - delete oldest archive channel ${oldestChannel.name}`
        );

        await oldestChannel.delete();

        // If the category is now empty, delete the category too
        if (oldestArchiveCategory.children.size === 0) {
          console.log(`Delete empty category ${oldestArchiveCategory.name}`);
          await category.delete();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { once, name, invoke };
