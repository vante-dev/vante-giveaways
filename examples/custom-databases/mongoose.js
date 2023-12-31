const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMembers]
});


// Connect to the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');
const db = mongoose.connection;

// Check the connection
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB.');
});

// Create the schema for giveaways
const giveawaySchema = new mongoose.Schema(
    {
        messageId: String,
        channelId: String,
        guildId: String,
        startAt: Number,
        endAt: Number,
        ended: Boolean,
        winnerCount: Number,
        prize: String,
        messages: {
            giveaway: String,
            giveawayEnded: String,
            giveawayEndedButton: String,
            title: String,
            inviteToParticipate: String,
            drawing: String,
            dropMessage: String,
            winMessage: mongoose.Mixed,
            embedFooter: mongoose.Mixed,
            noWinner: String,
            winners: String,
            endedAt: String,
            hostedBy: String,
            participants: String
        },
        thumbnail: String,
        image: String,
        hostedBy: String,
        winnerIds: { type: [String], default: undefined },
        participants: { type: [String], default: undefined },
        botsCanWin: Boolean,
        embedColor: mongoose.Mixed,
        embedColorEnd: mongoose.Mixed,
        exemptPermissions: { type: [], default: undefined },
        exemptMembers: String,
        bonusEntries: String,
        extraData: mongoose.Mixed,
        lastChance: {
            enabled: Boolean,
            content: String,
            threshold: Number,
            embedColor: mongoose.Mixed
        },
        pauseOptions: {
            isPaused: Boolean,
            content: String,
            unPauseAfter: Number,
            embedColor: mongoose.Mixed,
            durationAfterPause: Number,
            infiniteDurationText: String
        },
        isDrop: Boolean,
        allowedMentions: {
            parse: { type: [String], default: undefined },
            users: { type: [String], default: undefined },
            roles: { type: [String], default: undefined }
        }
    },
    { id: false }
);

// Create the model
const giveawayModel = mongoose.model('giveaways', giveawaySchema);

const { GiveawaysManager } = require('discord-giveaways');
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
        // Get all giveaways from the database. We fetch all documents by passing an empty condition.
        return await giveawayModel.find().lean().exec();
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageId, giveawayData) {
        // Add the new giveaway to the database
        await giveawayModel.create(giveawayData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageId, giveawayData) {
        // Find by messageId and update it
        await giveawayModel.updateOne({ messageId }, giveawayData).exec();
        // Don't forget to return something!
        return true;
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageId) {
        // Find by messageId and delete it
        await giveawayModel.deleteOne({ messageId }).exec();
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
        buttonEmoji: '🎉',
        buttonStyle: Discord.ButtonStyle.Secondary,
        embedColor: '#FF0000',
        embedColorEnd: '#000000',
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;

client.giveawaysManager.on('giveawayJoined', (giveaway, member, interaction) => {
    if (!giveaway.isDrop) return interaction.reply({ content: `:tada: Congratulations **${member.user.username}**, you have joined the giveaway`, ephemeral: true })
  
    interaction.reply({ content: `:tada: Congratulations **${member.user.username}**, you have joined the drop giveaway`, ephemeral: true })
});
  
client.giveawaysManager.on('giveawayLeaved', (giveaway, member, interaction) => {
    if (!giveaway.isDrop) return interaction.reply({ content: `**${member.user.username}**, you have left the giveaway`, ephemeral: true })
  
    interaction.reply({ content: `**${member.user.username}**, you have left the drop giveaway`, ephemeral: true })
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.login(process.env.DISCORD_BOT_TOKEN);