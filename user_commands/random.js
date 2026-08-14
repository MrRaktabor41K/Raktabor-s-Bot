const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Рандомное число")
        .addIntegerOption(option =>
            option
                .setName("min")
                .setDescription("Минимальное число")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("max")
                .setDescription("Максимальное число")
                .setRequired(true)
        ),

    cooldown: 5,

    async execute(interaction) {
        const min = interaction.options.getInteger("min");
        const max = interaction.options.getInteger("max");

        if (min >= max) {
            const container = new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(
                            "❌ Минимальное число должно быть меньше максимального."
                        )
                );

            return interaction.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
            });
        }

        const number = Math.floor(Math.random() * (max - min + 1)) + min;

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        [
                            "# 🎲 Случайное число",
                            "",
                            `Выпало число: **${number}**`
                        ].join("\n")
                    )
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};