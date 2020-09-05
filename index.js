// require all the things
const Discord = require('discord.js');
const fs = require('fs').promises

// make a client
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } })
