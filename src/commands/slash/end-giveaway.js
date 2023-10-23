const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messages = require("../../messages");
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("end-giveaway")
    .setDescription("Ens a giveaway")
    .addStringOption((option) => 
      option.setName("giveaway")
      .setDescription("The giveaway to end (message ID or giveaway prize)")
      .setRequired(true)
    ),

    run: async (client, interaction) => {
      const query = interaction.options.getString('giveaway');

      // try to found the giveaway with prize then with ID
      const giveaway = 
          // Search with giveaway prize
          client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
          // Search with giveaway ID
          client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

      // If no giveaway was found
      if (!giveaway) {
          return interaction.reply({
              content: 'Unable to find a giveaway for `'+ query + '`.',
              ephemeral: true
          });
      }

      if (giveaway.ended) {
          return interaction.reply({
              content: 'This giveaway is already ended.',
              ephemeral: true
          });
      }

      // end the giveaway
      client.giveawaysManager.end(giveaway.messageId)
      // Success message
      .then(() => {
          // Success message
          interaction.reply('Giveaway ended!');
      })
      .catch((e) => {
          interaction.reply({
              content: e,
              ephemeral: true
          });
      });
    }
 };
