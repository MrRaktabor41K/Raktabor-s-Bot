const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const checkVoiceOwner = require("../../utils/checkVoiceOwner");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Закрыть комнату"),

    async execute(interaction) {
        const channel =
            await checkVoiceOwner(interaction);

        if (!channel) return;

        const everyone =
            interaction.guild.roles.everyone;

        await channel.permissionOverwrites.edit(
            everyone,
            {
                Connect: false,
                ViewChannel: true,
                SendMessages: true
            }
        );

        await interaction.reply({
            content: "🔒 Комната закрыта.",
            ephemeral: true
        });
    }
};