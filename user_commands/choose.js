const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("choose")
        .setDescription("Выбрать вариант")
        .addStringOption(option =>
            option
                .setName("variants")
                .setDescription("Варианты через запятую")
                .setRequired(true)
        ),
    
        cooldown: 5,

    async execute(interaction) {
        const variants = interaction.options.getString("variants");

        const choices = variants
            .split(",")
            .map(v => v.trim())
            .filter(Boolean);

        if (choices.length < 2) {
            const container = new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent("❌ Укажите минимум **2 варианта** через запятую.")
                );

            return interaction.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
            });
        }

        const choice = choices[Math.floor(Math.random() * choices.length)];

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        "# 🤔 Делаю выбор",
                        `Варианты:** ${choices.join(", ")}**`,
                        `Я выбираю: **${choice}**`
                    ].join("\n")
                )
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};