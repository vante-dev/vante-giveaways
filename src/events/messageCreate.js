const { ChannelType, Collection, Events } = require("discord.js")
const config = require("../config.js")
const ms = require("ms")
const cooldown = new Collection()

module.exports = {
 name: Events.MessageCreate,
 execute: async(message) => {
  let client = message.client;
  if (message.author.bot) return;
  if (message.channel.type === ChannelType.DM) return;
  let prefix = config.prefix
  if(!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g); 
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0 ) return;
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.commandaliases.get(cmd));

  if(command) {
    if(command.cooldown) {
      if(cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ content: `Cooldown is active now, please \`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true})}\` try again later .`}).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()))
      command.run(client, message, args)
      cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
      setTimeout(() => {
        cooldown.delete(`${command.name}${message.author.id}`)
      }, command.cooldown);
  } else {
    command.run(client, message, args)
  }
  }
  }};
