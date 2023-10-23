const { Client, Collection, GatewayIntentBits, Partials, ButtonStyle } = require("discord.js");
const { GiveawaysManager } = require("vante-giveaways");

const client = new Client({
  intents: [GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember],
  shards: "auto"
});

const config = require("./src/config.js");
const { readdirSync } = require("node:fs");
const moment = require("moment");

let token = config.token;

client.commandaliases = new Collection();
client.commands = new Collection();
client.slashcommands = new Collection();
client.slashdatas = [];
client.giveawaysManager = new GiveawaysManager(client, { 
  storage: './giveaways.json',
  default: {
      botsCanWin: true,
      embedColor: '#0a0000',
      buttonEmoji: '🎉',
      buttonStyle: ButtonStyle.Secondary,
      lastChance: {
        enabled: true,
        content: '⚠️ **LAST CHANCE TO ENTER !** ⚠️',
        threshold: 10000,
        embedColor: '#FF0000'
      }
  }
}); 

client.giveawaysManager.on('giveawayJoined', (giveaway, member, interaction) => {
  if (!giveaway.isDrop) return interaction.reply({ content: `:tada: Congratulations **${member.user.username}**, you have joined the giveaway`, ephemeral: true })

  interaction.reply({ content: `:tada: Congratulations **${member.user.username}**, you have joined the drop giveaway`, ephemeral: true })
});

client.giveawaysManager.on('giveawayLeaved', (giveaway, member, interaction) => {
  if (!giveaway.isDrop) return interaction.reply({ content: `**${member.user.username}**, you have left the giveaway`, ephemeral: true })

  interaction.reply({ content: `**${member.user.username}**, you have left the drop giveaway`, ephemeral: true })
});

function log(message) {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${message}`);
};
client.log = log

// Command handler
readdirSync("./src/commands/prefix").forEach(async (file) => {
  const command = await require(`./src/commands/prefix/${file}`);
  if (command) {
    client.commands.set(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach((alias) => {
        client.commandaliases.set(alias, command.name);
      });
    }
  }
});

// Slash command handler
const slashcommands = [];
readdirSync("./src/commands/slash").forEach(async (file) => {
  const command = await require(`./src/commands/slash/${file}`);
  client.slashdatas.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
});

// Event handler
readdirSync("./src/events").forEach(async (file) => {
  const event = await require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// Process listeners
process.on("unhandledRejection", (e) => {
  console.log(e);
});
process.on("uncaughtException", (e) => {
  console.log(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
  console.log(e);
});

client.login(token);
