let slash = [];
const { readdirSync } = require("fs");
const ascii = require("ascii-table");

let table = new ascii("Slash Commands");
table.setHeading("Slash Command", "Load Status");

module.exports = (client) => {

  readdirSync("./slash/").forEach(dir => {
    const commands = readdirSync(`./slash/${dir}/`).filter(file => file.endsWith(".js"));

    for (let file of commands) {
      const cmd = require(`../slash/${dir}/${file}`);

      if (!cmd.name || !cmd.description) {
        table.addRow(file, "❌");
        continue;
      }

      client.slash.set(cmd.name, cmd);

      slash.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options || []
      });

      table.addRow(file, "✅");
    }
  });

  console.log(table.toString());

  client.on("ready", async () => {
    await client.application.commands.set(slash);
  });
};
