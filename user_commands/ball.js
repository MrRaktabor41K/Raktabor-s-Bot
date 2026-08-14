const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ball")
        .setDescription("Магический шар")
        .addStringOption(option =>
            option
                .setName("question")
                .setDescription("Ваш вопрос")
                .setRequired(true)
        ),

    cooldown: 5,

    async execute(interaction) {
        const question = interaction.options.getString("question");

        const answers = [
            "Да",
            "Нет",
            "Возможно",
            "Скорее всего",
            "Сомневаюсь",
            "Определённо да",
            "Определённо нет"
        ];

        const answer = answers[Math.floor(Math.random() * answers.length)];

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        "# 🎱 Магический шар",
                        "",
                        `**Вопрос:** ${question}`,
                        `**Ответ:** ${answer}`
                    ].join("\n")
                )
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};