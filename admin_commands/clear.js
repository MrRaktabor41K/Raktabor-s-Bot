const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Очистить чат")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Количество сообщений")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {
        const amount =
            interaction.options.getInteger("amount");

        await interaction.deferReply({
            ephemeral: true
        });

        const deleted =
            await interaction.channel.bulkDelete(
                amount,
                true
            );

        await interaction.editReply(
            `Успешно удалено ${deleted.size} сообщений.`
        );
    }
};