const Discord = require("discord.js")

module.exports = {
	name: 'conf',
	usage: `[edit/reset/view] [key] [value]`,
	guildOnly: true,
	enabled: true,
	level: 2,
	aliases: ['set', 'settings', 'config'],
	category: 'Settings',
	description: 'Manage the settings for your server.',
	moreHelp:
		`\`conf\` - shows all the current settings for the server.
\`conf edit [key] [value]\` - change the value of a setting.
\`conf reset [key]\` - reset the value of a setting to the default.
\`conf view [key]\` - view the current value of a setting.`
}
const parseValue = (value) => {
	if (value == true) value = 'yes'
	if (value == false) value = 'no'
	if (value == undefined) value = 'none'
	if (value.name) value = value.name
	return value
}

module.exports.run = async (client, message, args, level) => {
	const descs = {
		prefix: 'The prefix is what you must put before a message to use a command.\n' +
			`A user can always use my mention (<@${client.user.id}>) as a prefix.`,
		logChannel: 'This is the channel in which data is logged.',
		modRole: 'Users with this role can perform moderator actions.',
		adminRole: 'Users with this role can perform administrator actions.\n' +
			'Users with Manage Server or Administrator permissions also get this.',
		support: 'When this is enabled, bot support users can access all commands.'
	}
	const types = {
		prefix: 'string',
		logChannel: 'channel',
		modRole: 'role',
		adminRole: 'role',
		support: 'bool'
	}
	let settings = message.settings
	if (!args[0]) {
		let set = Object.keys(settings).map(s => {
			let value = settings[s]
			value = parseValue(value)
			return { value, name: s + ':', inline: true }
		})
		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.guild.name} settings:`)
			.setColor('GOLD')
			.addFields(set)
		return message.channel.send(embed)
	}
	let subCommand = args.shift()
	if (subCommand == 'view') {
		let view = args.shift()
		let value = message.settings[view]
		if (value === undefined) return message.reply(`no setting found called \`${view}\`!`)
		value = parseValue(value)
		let desc = descs[view] || 'There is no info for this setting.'
		const embed = new Discord.MessageEmbed()
			.setTitle(view)
			.setDescription(desc)
			.addField('Current Value:', value)
			.setColor('GOLD')
		return message.channel.send(embed)
	}
	if (subCommand == 'edit') {
		let setting = args.shift()
		let value = settings[setting]
		if (value === undefined) return message.reply(`no setting found called \`${setting}\`!`)
		let type = types[setting] || 'string'
		newValue = undefined;
		let input = args.join(' ')
		if (type == 'string')
			newValue = input
		if (type == 'bool') {
			let trueStrings = ['true', 'yes', 't', 'y']
			let falseStrings = ['false', 'no', 'f', 'n']
			if (trueStrings.includes(input.toLowerCase())) newValue = true;
			if (falseStrings.includes(input.toLowerCase())) newValue = false;
		}
		if(newValue === undefined) return message.reply(`invalid new value for \`${setting}\`!`)
		await client.settings.set(`${message.guild.id}.${setting}`, newValue)
		return message.channel.send(`Successfully set new value for \`${setting}\` to \`${parseValue(newValue)}\`.`)
	}
}