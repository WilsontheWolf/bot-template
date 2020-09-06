module.exports = (client) => {
	client.loadCommand = (cmd) => {
		try {
			console.log(`Loading command ${cmd}...`)
			const c = require(`../commands/${cmd}`)
			client.commands.set(c.info.name, c)
			c.info.aliases.forEach(a => client.aliases.set(a, c.info.name))
		} catch (e) {
			console.error(`Error loading command ${cmd}:`)
			console.error(e)
			return error
		}
	}
	client.loadEvent = (evt) => {
		try {
			console.log(`Loading event ${evt}...`)
			const e = require(`../events/${evt}`)
			client.on(evt.split('.')[0], e.bind(null, client));
		} catch (e) {
			console.error(`Error loading event ${evt}:`)
			console.error(e)
			return error
		}
	}
	client.getSettings = async (message) => {
		if(message.guild) return await client.settings.get(message.guild.id)
		else return client.config.settings
	} 
}