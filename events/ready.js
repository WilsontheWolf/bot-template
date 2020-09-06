module.exports = async (client) => {
	console.log(`Connected as ${client.user.tag} (${client.user.id})`)
	console.log(`I'm in ${client.guilds.cache.size} guilds, with ${client.channels.cache.size} channels and ${client.users.cache.size} users.`)

	// ensure the internal db has the important stuff
	client.internal.ensure('support', [])
}