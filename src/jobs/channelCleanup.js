import {archive, allowedCategories} from '../utils/archive.js';

export function channelCleanup(client) {
  console.log('===== starting scheduled channel cleanup =====');
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const categories = guild.channels.cache.filter(channel => allowedCategories.includes(channel.name))

  const allowed = /(\d{1,2})-(\d{1,2})/

  // do nothing for these format for now, too risky
  const forbidden1 = /(\d{1,2})-(\d{1,2})-(\d{1,2})/ // 04-05-06
  const forbidden2 = /(janvier|fevrier|mars|avril|mai|juin|juillet|septembre|octobre|novembre|decembre)/ // 04-05-juin

  categories.forEach(category => {
    const today = new Date()
    let channels = category.children.cache
    channels.forEach(channel => {

        let match = allowed.exec(channel.name)
        // if month is found as a string (e.g. "juin"), do nothing for now, too risky
        if (!allowed.exec(channel.name) || forbidden1.exec(channel.name) || forbidden2.exec(channel.name)) {
            console.log(`format invalide ${channel.name}`);
            return
        }

        let channel_date = new Date(today.getFullYear(), (parseInt(match[2]) - 1), (parseInt(match[1]) + 1));

        if (today > channel_date) {
            console.log(`${channel.name} too old, archiving !`);
            archive(channel)
        } else {
            console.log(`${channel.name} OK`);
        }
    });
  });
}