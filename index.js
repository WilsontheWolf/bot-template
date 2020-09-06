// require all the things
const Discord = require('discord.js');
const fs = require('fs').promises
const Josh = require('josh')
const provider = require('@josh-providers/sqlite')
require('dotenv').config()

// make a client
const client = new Discord.Client({ ws: { intents: Discord.Intents.NON_PRIVILEGED } })

// config and stuff
client.config = require('./config.js')
require("./modules/functions.js")(client);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// db stuff
client.settings = new Josh({
	name: "settings",
	provider,
	autoEnsure: client.config.settings
});

(async () => {
	let commands = await fs.readdir('./commands')
	console.log(`Loading ${commands.length} commands.`)
	commands.forEach(cmd => {
		if (!cmd.endsWith('.js')) return;
		let r = client.loadCommand(cmd)
		if (!r) console.log(`Successfully loaded ${cmd}!`)
	})
	let events = await fs.readdir('./events')
	console.log(`Loading ${events.length} events.`)
	events.forEach(evt => {
		if (!evt.endsWith('.js')) return;

		let r = client.loadEvent(evt)
		if (!r) console.log(`Successfully loaded ${evt}!`)
	})
	client.login(client.config.token)
})()