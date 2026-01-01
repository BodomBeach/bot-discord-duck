import 'dotenv/config';
import { Client, GatewayIntentBits, ChannelType, CategoryChannel, ForumChannel, TextChannel } from 'discord.js';

// Create a new Client with the Guilds intent
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) return;

  let members = await guild.members.fetch();
  const categoryChannel = guild.channels.cache.get('1243090353494691879') as CategoryChannel | undefined;
  const forumChannel = guild.channels.cache.get('1244537924993679402') as ForumChannel | undefined;

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

  const textChannels = categoryChannel.children.cache.filter(channel => channel.type === ChannelType.GuildText);

  const webhook = await forumChannel.createWebhook({ name: 'migration_temp' });

  try {
    for (const channel of textChannels.values()) {
      const textChannel = channel as TextChannel;

      // if (channel.name !== '38-alpes-dhuez') continue

      let messages = await textChannel.messages.fetch({ limit: 100 }).then(messages => {
        console.log(`${channel.name} : ${messages.size} messages`);
        return messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      });

      // Create a new post in the forum
      const thread = await forumChannel.threads.create({
        name: channel.name,
        message: { content: `Migrating messages from #${channel.name}` }
      });

      for (const message of messages.values()) {
        await webhook.send({
          content: message.content,
          threadId: thread.id,
          username: message.member?.nickname || message.author.username,
          files: message.attachments.map(x => x)
        })
          .then(msg => {
            console.log(`Sent message: ${msg.content}`);
          })
          .catch(console.error);
      }

      console.log(`Migrated messages from ${channel.name} to ${thread.name}`);
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error(error);
  }
  console.log('deleting webhook');
  webhook.delete();
});

client.login(process.env.BOT_TOKEN);
