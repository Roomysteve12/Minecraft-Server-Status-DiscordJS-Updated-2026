const Discord = require('discord.js')

module.exports = {
  name: 'ping',
  description: 'Check Discord Bot Ping!',
run: async (client, inter, config, db) => {
  let embed = new Discord.EmbedBuilder()

      .setThumbnail(inter.guild.iconURL())
      .setColor(0xFF0033)
      .setTitle(`${config.emoji || ":skull:"} | Ping`)
      .setDescription(`${Math.floor(inter.client.ws.ping)}ms`)
      .setFooter({ text: 'Created By Roomy12#9873'})

      inter.reply({ embeds: [embed], ephemeral: true })
}
}
