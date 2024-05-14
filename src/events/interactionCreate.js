const once = false;
const name = 'interactionCreate';

async function invoke(interaction) {
	// Check if the interaction is a command and call the invoke method in the corresponding file
	if (interaction.isChatInputCommand())
		(await import(`./commands/${interaction.commandName}.js`)).invoke(interaction);
}

export { once, name, invoke };
