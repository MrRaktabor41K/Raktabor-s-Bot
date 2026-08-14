const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Аватар пользователя")
        .addUserOption(
            option => option
                .setName("user")
                .setDescription("Пользователь")
                .setRequired(false)
        ),

    cooldown: 20,

    async execute(interaction) {
        const user = interaction.options.getUser("user") ?? interaction.user;

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`## Аватар ${user.username}`)
            )
            .addMediaGalleryComponents(
                new MediaGalleryBuilder().addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(user.displayAvatarURL({ extension: "png", size: 1024 }))
                )
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};