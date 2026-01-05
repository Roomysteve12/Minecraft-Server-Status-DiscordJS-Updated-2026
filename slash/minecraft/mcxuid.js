const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'mcxuid',
  description: 'Check Bedrock Player XUID!',
  options: [
    {
      name: "player",
      description: "Input Bedrock Player Name",
      type: 3,
      required: true
    }
  ],
run: async (client, inter, config, db) => {
  const player_name = inter.options.getString("player");
  let { xuid } = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${player_name}`).then(response => response.json())
  
  const { icon } = await fetch(`https://mcprofile.io/api/v1/bedrock/gamertag/${player_name}`).then(response => response.json())

  const attachment = new Discord.AttachmentBuilder(icon, {
  name: `${player_name}.png`
  });

  if(xuid) {
    let embed = new Discord.EmbedBuilder()

    .setThumbnail(`attachment://${player_name}.png`)
    .setColor(0x99FF00)
    .setTitle(`${config.emoji || ":skull:"} | Minecraft Player UUID`)
    .addFields({ name: 'Player Name: ', value: `${player_name}`})
    .addFields({ name: 'Player XUID: ', value: `${xuid}`})
    .setFooter({ text: 'Created By _roomysteve12'})

    inter.reply({ embeds: [embed], files: [attachment] })
  } else {
    inter.reply({ content: "Player Not Found!", ephemeral: true })
  }
}
}
