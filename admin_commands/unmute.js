const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Снять тайм-аут")
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("Пользователь")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(interaction) {
        const member = await interaction.guild.members.fetch(
            interaction.options.getUser("member").id
        );

        if (
            member.roles.highest.position >=
                interaction.member.roles.highest.position &&
            interaction.guild.ownerId !== interaction.user.id
        ) {
            return interaction.reply({
                content:
                    "Вы не можете снять тайм-аут с этого пользователя.",
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: "У меня недостаточно прав.",
                ephemeral: true
            });
        }

        await member.timeout(
            null,
            `Размутил ${interaction.user.tag}`
        );


        await interaction.reply({
                content:
                    "Пользователь был размучен.",
                ephemeral: true
            });
    }
};