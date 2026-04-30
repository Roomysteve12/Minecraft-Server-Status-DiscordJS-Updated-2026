const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'mcstatus',
  description: 'Check Status Of Minecraft Server!',
run: async (client, inter, config, db) => {

  let uptime = db.get('up')

  const start = Date.now();

  if(config.software === 'bedrock') {
   let { motd, players, online, version } = await fetch(`https://api.mcsrvstat.us/bedrock/3/${config.ip}:${config.port}`).then(response => response.json())

   let player = players
   if(!player) player = "null"
   
   let ping = Date.now() - start;

    if(online === false) {
      let embed = new Discord.EmbedBuilder()

      .setThumbnail(inter.guild.iconURL())
      .setColor(0xFF0033)
      .setTitle(`${config.emoji || ":skull:"} | Minecraft Server Status`)
      .addFields({ name: 'Status: ', value: ':red_circle: Offline' })
      .setFooter({ text: 'Created By _roomysteve12'})

      inter.reply({ embeds: [embed], ephemeral: true })
    }

    if(online == true) {
    let embed = new Discord.EmbedBuilder()

      .setColor(0x99FF00)
      .setThumbnail(inter.guild.iconURL())
      .setTitle(`${config.emoji || ":skull:"} | ${inter.guild.name}'s Status`)
      .addFields({ name: 'Status: ', value: ':green_circle: Online', inline: true })
      .addFields({ name: 'Players/Max: ', value: `${player.online}/${player.max}`, inline: true })
      .addFields({ name: 'Version: ', value: `${version}`, inline: true})
      .addFields({ name: 'Uptime: ', value: `${uptime}%`, inline: true})
      .addFields({ name: 'Ping: ', value: (ping / 5).toFixed(2) + "ms", inline: true})
      .setFooter({ text: 'Created By _roomysteve12'})

      inter.reply({ embeds: [embed] })
    }
  }

  if(config.software === 'java') {
   let { motd, players, online, version } = await fetch(`https://api.mcstatus.io/v2/status/java/${config.ip}:${config.port}`).then(response => response.json()) 
    
    if(!players) players = "No Players!"
    let ping = Date.now() - start;

    if(online === false) {
      let embed = new Discord.EmbedBuilder()

      .setThumbnail(inter.guild.iconURL())
      .setColor(0xFF0033)
      .setTitle(`${config.emoji || ":skull:"} | Minecraft Server Status`)
      .addFields({ name: 'Status: ', value: ':red_circle: Offline'})
      .setFooter({ text: 'Created By _roomysteve12'})

      inter.reply({ embeds: [embed], ephemeral: true })
    }

    if(online == true) {
    let embed = new Discord.EmbedBuilder()

      .setColor(0x99FF00)
      .setThumbnail(inter.guild.iconURL())
      .setTitle(`${config.emoji || ":skull:"} | ${inter.guild.name}'s Status`)
      .addFields({ name: 'Status: ', value: ':green_circle: Online', inline: true})
      .addFields({ name: 'Players/Max: ', value: `${players.online}/${players.max}`, inline: true})
      .addFields({ name: 'Players: ', value: `${players.list.map(item => item.name_clean)}` || "Too Many Players!"})
      .addFields({ name: 'Version: ', value: `${version.name_clean}`, inline: true})
      .addFields({ name: 'Uptime: ', value: `${uptime}%`, inline: true})
      .addFields({ name: 'Ping: ', value: (ping / 5).toFixed(2) + "ms", inline: true})
      .setFooter({ text: 'Created By _roomysteve12'})

      inter.reply({ embeds: [embed] })
      console.log(players)
    }
  }
  }
}
