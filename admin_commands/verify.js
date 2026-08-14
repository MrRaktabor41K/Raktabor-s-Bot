const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const {
    START_ROLE,
    VERIFY_ROLE
} = require("../config");

const CAPTCHAS = new Map();

function generateCaptcha() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let captcha = "";

    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return captcha;
}

module.exports = {
    name: "verify",

    cooldown: 5,

    async execute(message) {

        if (!message.member.permissions.has("Administrator")) {
            await message.delete();
            return;
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("🔐 **ВЕРИФИКАЦИЯ**")
            )

            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large)
            )

            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        "Нажмите кнопку ниже, чтобы пройти проверку."
                    )
            )

            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large)
            )

            .addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("verify_start")
                            .setLabel("Начать")
                            .setStyle(ButtonStyle.Success)
                    )
            );

        await message.channel.send({
            components: [container],
            flags: 1 << 15
        });
    },

    async button(interaction) {

        if (interaction.customId !== "verify_start") {
            return;
        }

        const member = interaction.member;

        // Уже прошёл проверку
        if (
            VERIFY_ROLE &&
            member.roles.cache.has(VERIFY_ROLE)
        ) {
            return interaction.reply({
                content: "✅ Вы уже прошли верификацию.",
                ephemeral: true
            });
        }

        const captcha = generateCaptcha();

        CAPTCHAS.set(
            interaction.user.id,
            captcha
        );

        const modal = new ModalBuilder()
            .setCustomId("verify_captcha")
            .setTitle("Проверка капчей");

        const input = new TextInputBuilder()
            .setCustomId("captcha")
            .setLabel(`Введите код: ${captcha}`)
            .setPlaceholder("Введите код выше")
            .setStyle(TextInputStyle.Short)
            .setMinLength(5)
            .setMaxLength(5)
            .setRequired(true);

        const row = new ActionRowBuilder()
            .addComponents(input);

        modal.addComponents(row);

        await interaction.showModal(modal);
    },

    async modal(interaction) {

        if (interaction.customId !== "verify_captcha") {
            return;
        }

        const userId = interaction.user.id;

        const correctCaptcha =
            CAPTCHAS.get(userId);

        if (!correctCaptcha) {
            return interaction.reply({
                content:
                    "❌ Капча устарела. Нажмите «Начать» ещё раз.",
                ephemeral: true
            });
        }

        const enteredCaptcha =
            interaction.fields
                .getTextInputValue("captcha")
                .toUpperCase();

        if (enteredCaptcha !== correctCaptcha) {

            CAPTCHAS.delete(userId);

            return interaction.reply({
                content:
                    "❌ Неверная капча. Нажмите «Начать» ещё раз.",
                ephemeral: true
            });
        }

        CAPTCHAS.delete(userId);

        const giveRole =
            interaction.guild.roles.cache.get(
                VERIFY_ROLE
            );

        const removeRole =
            interaction.guild.roles.cache.get(
                START_ROLE
            );

        try {

            if (removeRole) {
                await interaction.member.roles.remove(
                    removeRole
                );
            }

            if (giveRole) {
                await interaction.member.roles.add(
                    giveRole
                );
            }

        } catch (error) {

            console.error(error);

            return interaction.reply({
                content:
                    "❌ У бота недостаточно прав для выдачи роли.",
                ephemeral: true
            });
        }

        await interaction.reply({
            content:
                "✅ Вы успешно прошли верификацию!",
            ephemeral: true
        });
    }
};