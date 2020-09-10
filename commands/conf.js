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

module.exports.run = async (client, message, args, level) => {
	let settings = message.settings
	if(!args) {
		
		message.channel.send()
	}
}