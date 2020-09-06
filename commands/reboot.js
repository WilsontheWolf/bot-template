module.exports = {
	name: 'reboot',
	usage: ``,
	guildOnly: false,
	enabled: true,
	level: 9,
	aliases: ['restart', 'shutdown'],
	category: 'System',
	description: 'Shut down the bot.'
}
module.exports.run = async (client, message, args, level) => {
	await message.reply('rebooting...')
	process.exit()
}