const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Сказать что-то через бота")
        .addStringOption(option =>
            option
                .setName("msg")
                .setDescription("Сообщение")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {
        const msg =
            interaction.options.getString("msg");

        await interaction.channel.send(msg);

        await interaction.reply({
            content: "Сообщение отправлено.",
            ephemeral: true
        });
    }
};