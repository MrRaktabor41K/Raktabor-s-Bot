const {
    SlashCommandBuilder
} = require("discord.js");

const checkVoiceOwner = require("../../utils/checkVoiceOwner");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Открыть комнату"),

    async execute(interaction) {
        const channel =
            await checkVoiceOwner(interaction);

        if (!channel) return;

        const everyone =
            interaction.guild.roles.everyone;

        await channel.permissionOverwrites.edit(
            everyone,
            {
                Connect: true,
                ViewChannel: true,
                SendMessages: true
            }
        );

        await interaction.reply({
            content: "🔓 Комната открыта.",
            ephemeral: true
        });
    }
};