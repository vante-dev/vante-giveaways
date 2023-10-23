const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messages = require("../../messages");
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop-giveaway")
    .setDescription("Create a drop giveaway")
    .addIntegerOption((option) => 
        option.setName("winners")
        .setDescription("How many winners the giveaway should have")
        .setRequired(true)
    )
    .addStringOption((option) => 
        option.setName("prize")
        .setDescription("The prize for the giveaway")
        .setRequired(true)
    )
    .addChannelOption((option) => 
        option.setName("channel")
        .setDescription("The channel where the giveaway will be sent")
        .setRequired(true)
    ),



    run: async (client, interaction) => {
        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');

        client.giveawaysManager.start(giveawayChannel, {
            winnerCount: giveawayWinnerCount,
            prize: giveawayPrize,
            hostedBy: interaction.user,
            isDrop: true,
            messages
        });
    
        interaction.reply(`Giveaway started in ${giveawayChannel}!`);
    }
 };
