const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("give_role")
        .setDescription("Выдать роль пользователю")
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
                    "Я не могу выдать эту роль: она выше моей высшей роли.",
                ephemeral: true
            });
        }

        await member.roles.add(role);

        await interaction.reply({
            content:
                `Роль **${role.name}** успешно выдана ${member}.`,
            ephemeral: true
        });
    }
};