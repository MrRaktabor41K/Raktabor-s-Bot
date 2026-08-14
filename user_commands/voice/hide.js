const {
    SlashCommandBuilder
} = require("discord.js");

const checkVoiceOwner = require("../../utils/checkVoiceOwner");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hide")
        .setDescription("Скрыть комнату"),

    async execute(interaction) {
        const channel =
            await checkVoiceOwner(interaction);

        if (!channel) return;

        const everyone =
            interaction.guild.roles.everyone;

        await channel.permissionOverwrites.edit(
            everyone,
            {
                ViewChannel: false
            }
        );

        await interaction.reply({
            content: "👁️ Комната скрыта.",
            ephemeral: true
        });
    }
};