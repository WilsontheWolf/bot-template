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
		let settings = client.config.settings
		if (!message.guild) return settings
		let guildSettings = await client.settings.ensure(message.guild.id, {})
		return { ...settings, ...guildSettings }
	}
	client.getLevel = async (message) => {
		let level = 0
		for (let i = 0; i < client.config.perms.length; i++) {
			l = client.config.perms[i]
			if (await l.check(message)) level = l.level
		}
		return level
	}


	client.fetchUser = async (query) => {
		const mention = new RegExp(/<@!?\d+>/g);
		const beg = new RegExp(/<@!?/g);
		let user;
		if (query.match(mention)) {
			user = query.match(mention)[0];
			user = user.slice(query.match(beg)[0].length, user.length - 1);
			let result = undefined
			try {
				result = await client.users.fetch(user);
			} catch (e) { }
			return result
		}
		else {
			let result = undefined
			try {
				result = await client.users.fetch(query);
			} catch (e) { }
			return result;
		}
	}

	client.searchUser = async (search, msg) => {
		let result = await client.fetchUser(search);
		if (result && msg.guild) {
			try {
				result = await msg.guild.members.fetch(query);
			} catch (e) { }
		}
		if (result) return result;
		if (msg.guild) if (
			msg.guild.members.cache
				.filter(user =>
					user.displayName.toLowerCase().startsWith(search.toLowerCase())
				)
				.first()
		) {
			let users = msg.guild.members.cache
				.filter(user =>
					user.displayName.toLowerCase().startsWith(search.toLowerCase())
				)
				.array();
			if (users.length == 1) return users[0].user;
			let question = "";
			console.log(users.length);
			for (var i = 0; i != users.length && i != 10; i++) {
				question =
					question +
					`[${i + 1}] ${users[i].displayName} (${users[i].user.tag})
`;
			}
			let num = await client.awaitReply(
				msg,
				`Please choose one of these:
${question}`
			);
			return users[parseInt(num) - 1].user;
		}
		if (
			client.users.cache
				.filter(user =>
					user.username.toLowerCase().startsWith(search.toLowerCase())
				)
				.first()
		) {
			let users = client.users.cache
				.filter(user =>
					user.username.toLowerCase().startsWith(search.toLowerCase())
				)
				.array();
			if (users.length == 1) return users[0];
			let question = "";
			console.log(users.length);
			for (var i = 0; i != users.length && i != 10; i++) {
				question =
					question +
					`[${i + 1}] ${users[i].tag}
`;
			}
			let num = await client.awaitReply(
				msg,
				`Please choose one of these:
${question}`
			);
			return users[parseInt(num) - 1];
		}
	};
}