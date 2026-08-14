const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Подбросить монетку"),

    cooldown: 5,

    async execute(interaction) {
        const result = Math.random() < 0.5 ? "Орёл" : "Решка";

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        [
                            "# 🪙 Подбрасывание монетки",
                            "",
                            `Монетка показала: **${result}**`
                        ].join("\n")
                    )
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};