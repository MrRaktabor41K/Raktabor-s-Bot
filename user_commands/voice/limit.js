const {
    SlashCommandBuilder
} = require("discord.js");

const checkVoiceOwner = require("../../utils/checkVoiceOwner");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("limit")
        .setDescription("Установить лимит пользователей")
        .addIntegerOption(option =>
            option
                .setName("limit")
                .setDescription("Количество пользователей")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(99)
        ),

    async execute(interaction) {
        const channel =
            await checkVoiceOwner(interaction);

        if (!channel) return;

        const limit =
            interaction.options.getInteger("limit");

        await channel.setUserLimit(limit);

        await interaction.reply({
            content: `👥 Лимит: ${limit}`,
            ephemeral: true
        });
    }
};