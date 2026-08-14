const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("custom_embed")
        .setDescription(
            "Создает полностью настраиваемый embed"
        )

        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Заголовок")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("Описание")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("color")
                .setDescription(
                    "HEX-цвет, например #3498db"
                )
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("footer")
                .setDescription("Текст внизу")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("field_name")
                .setDescription("Название поля")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("field_value")
                .setDescription("Значение поля")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("image")
                .setDescription("URL изображения")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("thumbnail")
                .setDescription("URL миниатюры")
                .setRequired(false)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {
        const title =
            interaction.options.getString("title");

        const description =
            interaction.options.getString("description");

        const color =
            interaction.options.getString("color") ||
            "#3498db";

        const footer =
            interaction.options.getString("footer");

        const fieldName =
            interaction.options.getString("field_name");

        const fieldValue =
            interaction.options.getString("field_value");

        const image =
            interaction.options.getString("image");

        const thumbnail =
            interaction.options.getString("thumbnail");

        let colorValue = 0x3498db;

        const hex = color.replace("#", "");

        if (/^[0-9a-fA-F]{6}$/.test(hex)) {
            colorValue = parseInt(hex, 16);
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(colorValue);

        if (footer) {
            embed.setFooter({
                text: footer
            });
        }

        if (fieldName && fieldValue) {
            embed.addFields({
                name: fieldName,
                value: fieldValue,
                inline: false
            });
        }

        if (image) {
            embed.setImage(image);
        }

        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }

        await interaction.channel.send({
            embeds: [embed]
        });

        await interaction.reply({
            content: "Embed отправлен.",
            ephemeral: true
        });
    }
};