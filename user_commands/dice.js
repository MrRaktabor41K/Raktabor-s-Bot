const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Бросить кубик"),

    cooldown: 5,

    async execute(interaction) {
        const number = Math.floor(Math.random() * 6) + 1;

        const container =  new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        [
                    "# 🎲 Бросаем кубик",
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
