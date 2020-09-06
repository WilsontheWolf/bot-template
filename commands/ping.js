module.exports.info = {
	name: 'ping',
	usages: ``,
	guildOnly: false,
	enabled: true,
	level: 0,
	aliases: []
}
module.exports.run = async (client, message, args, level) => {
	let msg = await message.channel.send('Pong!');
	msg.edit(`🏓 Pong! The latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${client.ws.ping}ms.`)
}