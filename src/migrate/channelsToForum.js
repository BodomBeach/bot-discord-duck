require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new Client with the Guilds intent
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  let members = await guild.members.fetch();
  const categoryChannel = guild.channels.cache.get('1243090353494691879');
  const forumChannel = guild.channels.cache.get('1244537924993679402');

  if (!categoryChannel || !forumChannel) {
    console.error('Category or forum channel not found');
    return;
  }

  // // ================================= !!! DELETE FORUM, ONLY FOR TESTING !!! ===================================
  // const threads = await forumChannel.threads.fetchActive();
  // for (const thread of threads.threads.values()) {
  //   try {
  //     await thread.delete();
  //     console.log(`Deleted thread: ${thread.name}`);
  //   } catch (error) {
  //     console.error(`Failed to delete thread: ${thread.name}`, error);
  //   }
  // }
  // // ============================================================================================================

  const textChannels = categoryChannel.children.cache.filter(channel => channel.type === 0);

  const webhook = await forumChannel.createWebhook({ name: 'migration_temp' })

  try {
    for (const channel of textChannels.values()) {

      if (channel.name !== '38-alpes-dhuez') continue

      let messages = await channel.messages.fetch({ limit: 100 }).then(messages => {
        console.log(`${channel.name} : ${messages.size} messages`);
        return messages.sort(msg => -msg.createdTimestamp)
      })

      // Create a new post in the forum
      const thread = await forumChannel.threads.create({
        name: channel.name,
        message: { content: `Migrating messages from #${channel.name}` }
      });

      for (const message of messages.values()) {

        await webhook.send({ content: message.content, threadId: thread.id, username: message.member.nickname, files: message.attachments.map(x => x) })
          .then(message => {
            console.log(`Sent message: ${message.content}`)

          })
          .catch(console.error);
      }

      console.log(`Migrated messages from ${channel.name} to ${thread.name}`);
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error
  }
  console.log('deleting webhook');
  webhook.delete()

});

client.login(process.env.BOT_TOKEN);
