const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messages = require("../../messages");
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start-giveaway")
    .setDescription("Start a giveaway!")

    .addStringOption((option) => 
      option.setName("duration")
      .setDescription("How long the giveaway should last for. Example values: 1m, 1h, 1d")
      .setRequired(true)
    )

    .addIntegerOption((option) => 
      option.setName("winners")
      .setDescription("How many winners the giveaway should have")
      .setRequired(true)
    )

    .addStringOption((option) => 
      option.setName("prize")
      .setDescription("What the prize of the giveaway should be")
      .setRequired(true),
    )

    .addChannelOption((option) => 
      option.setName("channel")
      .setDescription("Where the giveaway should be hosted")
      .setRequired(true),
    ),

    run: async (client, interaction) => {
      const giveawayChannel = interaction.options.getChannel('channel');
      const giveawayDuration = interaction.options.getString('duration');
      const giveawayWinnerCount = interaction.options.getInteger('winners');
      const giveawayPrize = interaction.options.getString('prize');

      client.giveawaysManager.start(giveawayChannel, {
        duration: ms(giveawayDuration),
        prize: giveawayPrize,
        winnerCount: giveawayWinnerCount,
        hostedBy: interaction.user,
        messages
      });

      interaction.reply(`Giveaway started in ${giveawayChannel}!`);
    }
 };
