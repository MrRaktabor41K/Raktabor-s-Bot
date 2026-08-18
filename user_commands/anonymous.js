const { SlashCommandBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anonymous")
        .setDescription("Отправить сообщение в специальный канал")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Текст сообщения")
                .setRequired(true)
        ),

    cooldown: 600,

    async execute(interaction) {
        const message = interaction.options.getString("message");

        try {
            const channel = await interaction.client.channels.fetch(
                config.ANONYMOUS_ID
            );

            if (!channel || !channel.isTextBased()) {
                return interaction.reply({
                    content: "❌ Канал не найден.",
                    ephemeral: true
                });
            }

            await channel.send(message);

            await interaction.reply({
                content: "✅ Сообщение отправлено.",
                ephemeral: true
            });

        } catch (error) {
            console.error("Ошибка отправки сообщения:", error);

            await interaction.reply({
                content: "❌ Не удалось отправить сообщение.",
                ephemeral: true
            });
        }
    }
};