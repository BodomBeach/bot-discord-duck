import { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import puppeteer from 'puppeteer';

const url = 'http://www.murblanc.org/sthil';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('balise')
		.setDescription(`Affiche les valeurs des balises autour de Grenoble (source : ${url})`);
	return command.toJSON();
};

const invoke = async (interaction) => {
  console.log(`${interaction.user.username} used /balise`);
	interaction.deferReply();

	const image  = await getScreenhot('table table tbody');
	const embed = new EmbedBuilder()
		.setDescription(`${interaction.user.username} a utilisé la commande **/balise**`)
		.setImage(`attachment://dashboard.png`);

	const attachment = new AttachmentBuilder(image, 'screenshot.png');

	interaction.editReply({ embeds: [embed], files: [attachment] });
};

const getScreenhot = async (selector) => {
  // no-sandbox args are necessary to launch puppeteer as root (docker)
	const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
	const page = await browser.newPage();
	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1
	});

	try {
		await page.goto(url);
		// Wait for the element to be available
		await page.waitForSelector(selector);
	} catch (error) {
		console.error(error);
	};

	const nodeHandle = await page.$(selector);

	// Some css changes to the element
	await nodeHandle.evaluate((node) => {
		node.querySelectorAll('tr td:first-child').forEach((td) => td.style.fontSize = '38px');
		node.querySelectorAll('tr td:last-child').forEach((td) => td.style.fontSize = '20px');
	});

	// Take a screenshot of the element
	const boundingBox = await nodeHandle.boundingBox();
	const screenshot = await page.screenshot({
		clip: {
			x: boundingBox.x,
			y: boundingBox.y,
			width: boundingBox.width,
			height: boundingBox.height
		}
	});
	await browser.close();

	return screenshot;
  }

export { create, invoke };
