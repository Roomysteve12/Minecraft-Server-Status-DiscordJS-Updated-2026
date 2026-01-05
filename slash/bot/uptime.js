const Discord = require('discord.js')

module.exports = {
  name: 'uptime',
  description: 'Check Discord Bot Uptime!',
run: async (client, inter, config, db) => {

  function formatDuration(ms) {
  let seconds = Math.floor((ms / 1000) % 60),
      minutes = Math.floor((ms / (1000 * 60)) % 60),
      hours = Math.floor((ms / (1000 * 60 * 60)) % 24),
      days = Math.floor(ms / (1000 * 60 * 60 * 24));

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}
  
   let embed = new Discord.EmbedBuilder()

      .setThumbnail(inter.guild.iconURL())
      .setColor(0xFF0033)
      .setTitle(`${config.emoji || ":skull:"} | Uptime`)
      .setDescription(`${formatDuration(client.uptime)}`)
      .setFooter({ text: 'Created By _roomysteve12'})

      inter.reply({ embeds: [embed], ephemeral: true })
}
}
