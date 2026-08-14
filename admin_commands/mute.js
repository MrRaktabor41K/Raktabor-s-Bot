const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Выдать тайм-аут пользователю")
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("Пользователь")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("minutes")
                .setDescription("Длительность тайм-аута в минутах")
                .setMinValue(1)
                .setMaxValue(40320)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Причина")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const member = await interaction.guild.members.fetch(
            interaction.options.getUser("member").id
        );

        const minutes = interaction.options.getInteger("minutes");

        const reason =
            interaction.options.getString("reason") ||
            "Причина не указана";

        if (member.id === interaction.user.id) {
            return interaction.reply({
                content: "Нельзя замутить самого себя.",
                ephemeral: true
            });
        }

        if (
            member.roles.highest.position >=
                interaction.member.roles.highest.position &&
            interaction.guild.ownerId !== interaction.user.id
        ) {
            return interaction.reply({
                content: "Вы не можете замутить этого пользователя.",
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: "Я не могу выдать этому пользователю тайм-аут.",
                ephemeral: true
            });
        }

        await member.timeout(minutes * 60 * 1000, reason);

        await interaction.reply({
            content: "Пользователь был замучен.",
            ephemeral: true
        });
    }
};