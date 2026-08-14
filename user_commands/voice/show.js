const {
    SlashCommandBuilder
} = require("discord.js");

const checkVoiceOwner = require("../../utils/checkVoiceOwner");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show")
        .setDescription("Показать комнату"),

    async execute(interaction) {
        const channel =
            await checkVoiceOwner(interaction);

        if (!channel) return;

        const everyone =
            interaction.guild.roles.everyone;

        await channel.permissionOverwrites.edit(
            everyone,
            {
                ViewChannel: true
            }
        );

        await interaction.reply({
            content: "👁️‍🗨️ Комната видна.",
            ephemeral: true
        });
    }
};