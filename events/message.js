module.exports = async (client, message) => {
	if (message.author.bot) return;
	const settings = message.settings = await client.getSettings(message)
	const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
	if (message.content.match(mention))
		return message.reply(`my prefix${message.guild ? ' on this guild' : ''} is \`${settings.prefix}\``)
	const args = message.content.trim().split(/ +/g);

	if (!message.content.startsWith(settings.prefix)) {
		if (args[0].match(mention)) args.shift();
		else return
	} else args[0] = args[0].slice(settings.prefix.length)
	const command = args.shift().toLowerCase()

	if (message.guild && !message.member) await message.guild.members.fetch(message.author);

	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (!cmd) return

	if (!message.guild && cmd.conf.guildOnly)
		return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

	//todo: Setup perms stuff

	message.flags = [];
	while (args[0] && args[0][0] === "-") {
		message.flags.push(args.shift().slice(1));
	}

	try {
		console.log(`${message.author.tag} ran command ${command}.`)
		await cmd.run(client, message, args);
	} catch (e) {
		console.error(`Error running command!`)
		console.error(e)
		message.reply(`There was an unexpected error running that command.
if you get support on this error please provide this info: ${'```'}
${e}
${'```'}`)
	}
}