import { Client, TextChannel } from "discord.js";

export async function monthlyWeatherMessage(client: Client) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) {
    console.error('Guild not found for monthly weather message');
    return;
  }

  const meteoChannel = client.channels.cache.find(
    (channel) => channel.isTextBased() && 'name' in channel && channel.name === process.env.CHANNEL_METEO
  ) as TextChannel | undefined;

  if (!meteoChannel) {
    console.error(`Weather channel "${process.env.CHANNEL_METEO}" not found`);
    return;
  }

  const message = `**Tu hésites à aller voler ? Besoin d'un regard extérieur sur ta météo ?**

Ce salon est fait pour ça. Pose tes questions, partage tes analyses — il n'y a pas de question bête, et c'est en confrontant nos analyses qu'on progresse tous.

⚠️ Les avis partagés ici n'engagent que leurs auteurs. Au final, c'est ta sécurité, ta décision de voler ou non.`;

  try {
    await meteoChannel.send(message);
  } catch (error) {
    console.error('Error sending monthly weather message:', error);
  }
}
