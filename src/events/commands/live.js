const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const url = 'https://www.xcontest.org/api.s/widget/live-map/all/';

const create = () => {
  const command = new SlashCommandBuilder()
    .setName('live')
    .setDescription(`Active le suivi des pilotes du Duck pour la journée`);
  return command.toJSON();
};

const invoke = async (interaction) => {

  puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: false }).then(async browser => {

    const page = await browser.newPage();

    // block images
    await page.setRequestInterception(true);
    const blockedTypes = new Set(["image"]);
    page.on("request", (req) => {
      if (blockedTypes.has(req.resourceType())) {
        req.abort();
      } else req.continue();
    });

    // Setting page view
    await page.setViewport({ width: 1280, height: 720 });

    // Go to the website
    await page.goto(url);

    try {
      await page.waitForSelector('.CPiconOOO.flex.flex--space-between-main.flex--center-cross.svelte-13ah9e5', { timeout: 10000 });
      console.log('Button found');
      await page.click('.CPiconOOO.flex.flex--space-between-main.flex--center-cross.svelte-13ah9e5');

    } catch (error) {
      console.error('Element not found or click failed:', error);
    }
    // Wait for security check
    await sleep(86400000);
    await browser.close();
    // await page.screenshot({ path: 'nowsecure.png', fullPage: true });
  })
}

const sleep = async(ms) => {
  setInterval(() => {
    console.log('print shit');
  }, 1000);
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = { create, invoke };