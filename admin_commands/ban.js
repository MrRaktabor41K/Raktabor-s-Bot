const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Забанить пользователя")
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("Пользователь")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Причина")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const member = await interaction.guild.members.fetch(
            interaction.options.getUser("member").id
        );

        const reason =
            interaction.options.getString("reason") ||
            "Причина не указана";

        if (member.id === interaction.user.id) {
            return interaction.reply({
                content: "Нельзя забанить самого себя.",
                ephemeral: true
            });
        }

        if (
            member.roles.highest.position >=
                interaction.member.roles.highest.position &&
            interaction.guild.ownerId !== interaction.user.id
        ) {
            return interaction.reply({
                content: "Вы не можете забанить этого пользователя.",
                ephemeral: true
            });
        }

        if (!member.bannable) {
            return interaction.reply({
                content:
                    "Я не могу забанить этого пользователя. Проверьте права и иерархию ролей.",
                ephemeral: true
            });
        }

        await member.ban({
            reason: `${reason} | Модератор: ${interaction.user.tag}`
        });

        await interaction.reply({
            content: `Пользователь **${member.user.tag}** забанен.`,
            ephemeral: true
        });
    }
};