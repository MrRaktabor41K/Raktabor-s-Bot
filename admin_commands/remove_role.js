const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove_role")
        .setDescription("Забрать роль у пользователя")
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("Пользователь")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Роль")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {
        const member =
            await interaction.guild.members.fetch(
                interaction.options.getUser("member").id
            );

        const role =
            interaction.options.getRole("role");

        if (
            role.position >=
            interaction.guild.members.me.roles.highest.position
        ) {
            return interaction.reply({
                content:
                    "Я не могу снять эту роль: она выше моей высшей роли.",
                ephemeral: true
            });
        }

        await member.roles.remove(role);

        await interaction.reply({
            content:
                `Роль **${role.name}** успешно забрана у ${member}.`,
            ephemeral: true
        });
    }
};