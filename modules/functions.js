module.exports = (client) => {
	client.loadCommand = (cmd) => {
		try {
			console.log(`Loading command ${cmd}...`)
			const c = require(`../commands/${cmd}`)
			client.commands.set(c.name, c)
			c.aliases.forEach(a => client.aliases.set(a, c.name))
		} catch (e) {
			console.error(`Error loading command ${cmd}:`)
			console.error(e)
			return e
		}
	}

	client.unloadCommand = async commandName => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command)
      return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
    if (command.shutdown) {
      await command.shutdown(client);
    }
    const mod = require.cache[require.resolve(`../commands/${command.name}`)];
    delete require.cache[require.resolve(`../commands/${command.name}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  };

	client.loadEvent = (evt) => {
		try {
			console.log(`Loading event ${evt}...`)
			const e = require(`../events/${evt}`)
			client.on(evt.split('.')[0], e.bind(null, client));
		} catch (e) {
			console.error(`Error loading event ${evt}:`)
			console.error(e)
			return e
		}
	}
	client.getSettings = async (message) => {
		if (message.guild) return await client.settings.get(message.guild.id)
		else return client.config.settings
	}
	client.getLevel = async (message) => {
		let level = 0
		for (let i = 0; i < client.config.perms.length; i++) {
			l = client.config.perms[i]
			if (await l.check(message)) level = l.level
		}
		return level
	}

}