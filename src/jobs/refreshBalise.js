const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const puppeteer = require('puppeteer');
const url = 'http://www.murblanc.org/sthil';

async function refreshBalise(client) {
  console.log("===== starting scheduled balise update =====");

  const time = new Date().toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Europe/Paris",
  });

  const image = await getScreenhot("table table tbody");
  const embed = new EmbedBuilder()
    .setImage(`attachment://screenshot.png`)
    .setFooter({ text: `Dernière mise à jour : ${time}` });

  const balise = client.channels.cache.find(
    (channel) => channel.name === "🌪balises"
  );
  let messages = await balise.messages.fetch({ limit: 1 });


  const attachment = new AttachmentBuilder(image, 'screenshot.png');

  // Create or edit existing embed
  if (messages.size === 0) {
    balise.send({ embeds: [embed], files: [attachment] });
  } else {
    messages.first().edit({ embeds: [embed], files: [attachment] });
  }
  console.log("🌪balises updated");
}

const getScreenhot = async (selector) => {
  // no-sandbox args are necessary to launch puppeteer as root (docker)
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  try {
    await page.goto(url);
    // Wait for the element to be available
    await page.waitForSelector(selector);
  } catch (error) {
    console.error(error);
  }

  const nodeHandle = await page.$(selector);

  // Some css changes to the element
  await nodeHandle.evaluate((node) => {
    node
      .querySelectorAll("tr td:first-child")
      .forEach((td) => (td.style.fontSize = "38px"));
    node
      .querySelectorAll("tr td:last-child")
      .forEach((td) => (td.style.fontSize = "20px"));
  });

  // Take a screenshot of the element
  const boundingBox = await nodeHandle.boundingBox();
  const screenshot = await page.screenshot({
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
    },
  });
  await browser.close();

  return screenshot;
};

module.exports = { refreshBalise };
