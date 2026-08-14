const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nick")
        .setDescription("Изменить свой ник")
        .addStringOption(option =>
            option
                .setName("nick")
                .setDescription("Новый ник")
                .setRequired(true)
        ),

    cooldown: 600,

    async execute(interaction) {
        const nick = interaction.options.getString("nick");

        await interaction.member.setNickname(nick);

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        [
                            "# ✅ Ник изменён",
                            "",
                            `Ваш новый ник: **${nick}**`
                        ].join("\n")
                    )
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
        });
    }
};