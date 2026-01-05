const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'mcuuid',
  description: 'Check Java Player UUID!',
  options: [
    {
      name: "player",
      description: "Input Java Player Name",
      type: 3,
      required: true
    }
  ],
run: async (client, inter, config, db) => {
  const player_name = inter.options.getString("player");
  let { id } = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player_name}`).then(response => response.json())
  
const skin_url = await fetch(`https://mineskin.eu/helm/${player_name}`);
const skinBuffer = Buffer.from(await skin_url.arrayBuffer());

const attachment = new Discord.AttachmentBuilder(skinBuffer, {
  name: `${player_name}.png`
});

  if(id) {
    let embed = new Discord.EmbedBuilder() 

    .setThumbnail(`attachment://${player_name}.png`)
    .setColor(0x99FF00)
    .setTitle(`${config.emoji || ":skull:"} | Minecraft Player UUID`)
    .addFields({ name: 'Player Name: ', value: `${player_name}`})
    .addFields({ name: 'Player UUID: ', value: `${id}`})
    .setFooter({ text: 'Created By _roomysteve12'})

    inter.reply({ embeds: [embed], files: [attachment] })
  } else {
    inter.reply({ content: "Player Not Found!", ephemeral: true })
  } 
}
}