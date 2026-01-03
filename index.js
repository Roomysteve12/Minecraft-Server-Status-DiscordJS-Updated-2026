// Checker
const colors = require('colors')
const config = require('./config.json')
const software = ['java', 'bedrock']
if(!config.token || !config.software || !config.ip || !software.includes(config.software)) {
  return console.log(`Go To config.json file! \nToken: ${config.token || 'private'}\nSoftware: ${config.software || 'bedrock'}\nIp And Port: ${config.ip || 'play.example.net'}:${config.port || '19132'}`.red)
} else {
 console.log('Successfully!'.green)
}

if(config.software === 'bedrock') {
  if(!config.port) config.port = 19132
}
if(config.software === 'java') {
  if(!config.port) config.port = 25565
}

// Main JS
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
const Discord = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});
const fs = require('fs')
const SimplDB = require('simpl.db')
const db = new SimplDB()

const {
  setIntervalAsync,
  clearIntervalAsync
} = require('set-interval-async/dynamic')

client.slash = new Discord.Collection();

['slash'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on('ready', async () => {

  // changing status
  setIntervalAsync(
  async () => {

    if(config.software === 'bedrock') {
      const fetch = require('node-fetch')

      let { debug, motd, players, online } = await fetch(`https://api.mcsrvstat.us/bedrock/3/${config.ip}:${config.port}`).then(response => response.json())
      if(debug.query === false) {
      client.user.setPresence({ activities: [{ name: `Status: Offline` }]  })
      }

      if(!online && online === false) {
        client.user.setPresence({ activities: [{ name: `Status: Offline` }]  })
      }

      if(online === true) {
        client.user.setPresence({ activities: [{ name: `${motd.raw} | Status: Online | Players: ${players.online}/${players.max}` }]  })

  if(motd.raw.length === "24") client.user.setPresence({ activities: [{ name: `Bedrock Server | Status: Online | Players: ${players.online}/${players.max}` }]  })      
      }
    }

    if(config.software === 'java') {
      const fetch = require('node-fetch')

      let { debug, motd, players, online } = await fetch(`https://api.mcsrvstat.us/3/${config.ip}:${config.port}`).then(response => response.json())
      if(debug.ping === false) {
      client.user.setPresence({ activities: [{ name: `Status: Offline` }]  })
      }

      if(!online && online === false) {
        client.user.setPresence({ activities: [{ name: `Status: Offline` }]  })
      }

      if(online === true) {

  if(motd.raw.length === "24") client.user.setPresence({ activities: [{ name: `Java Server | Status: Online | Players: ${players.online}/${players.max}` }]  })      

        client.user.setPresence({ activities: [{ name: `Status: Online | Players: ${players.online}/${players.max}` }]  })
      }
    }

  }, config.interval) 

  // uptime

  setIntervalAsync(
  async () => {

    if(config.software === 'bedrock') {
      const fetch = require('node-fetch')

      let { debug, motd, players, online } = await fetch(`https://api.mcsrvstat.us/bedrock/2/${config.ip}:${config.port}`).then(response => response.json());
      if(debug.query === false) {
      client.user.setPresence({ activities: [{ name: `Status: Offline` }]  })
      }

      let uptime = db.get('up')

      if(!online && online === false) {
        if(uptime === 0) return;
        if(!uptime) db.set('up', 100)
        if(uptime) db.subtract('up', 1)
      }

      if(online === true) {
        if(uptime > 100) return;
        if(!uptime) db.set('up', 100)
        if(uptime) db.add('up', 1)
      }
    } 

    if(config.software === 'java') {
      const fetch = require('node-fetch')

      let { debug, motd, players, online } = await fetch(`https://api.mcsrvstat.us/2/${config.ip}:${config.port}`).then(response => response.json());
      if(debug.ping === false) {
      client.user.setPresence({ activities: [{ name: `Status: Offline` }]  })
      }
      let uptime = db.get('up')

      if(!online && online === false) {
        if(uptime === 0) return;
        if(!uptime) db.set('up', 100)
        if(uptime) db.subtract('up', 1)
      }

      if(online === true) {
        if(uptime > 100) return;
        if(!uptime) db.set('up', 100)
        if(uptime) db.add('up', 1)
      }
    }
  }, 60000)
})

client.on('interactionCreate', async (inter) => {

  if(!inter.isButton) return;
  const cmd = client.slash.get(inter.commandName);
  if(!cmd) return;

  const role = config.role
  if(role) {
  const only = inter.member.roles.cache.has(role)
  if(!only) return inter.reply({ content: `Only <@&${config.role}> Can Used This Command!`, ephemeral: true })
  }

  cmd.run(client, inter, config, db);
})

client.login(config.token).catch(err => {
  console.error('Invalid Token!'.red)
})
