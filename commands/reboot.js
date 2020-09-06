module.exports = {
	name: 'reboot',
	usages: ``,
	guildOnly: false,
	enabled: true,
	level: 9,
	aliases: ['restart', 'shutdown'],
	category: 'System'
}
module.exports.run = async (client, message, args, level) => {
	await message.reply('rebooting...')
	process.exit()
}