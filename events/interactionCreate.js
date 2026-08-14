const { Collection } = require("discord.js");

const cooldowns = new Collection();

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {

        // =====================================================
        // CAPTCHA — кнопка "Начать"
        // =====================================================

        if (interaction.isButton()) {

            if (interaction.customId === "verify_start") {

                const command =
                    interaction.client.commands.get("verify");

                if (!command || !command.button) return;

                try {
                    await command.button(interaction);
                } catch (error) {
                    console.error(error);

                    if (
                        !interaction.replied &&
                        !interaction.deferred
                    ) {
                        await interaction.reply({
                            content: "Произошла ошибка.",
                            ephemeral: true
                        });
                    }
                }

                return;
            }
        }

        // =====================================================
        // CAPTCHA — Modal
        // =====================================================

        if (interaction.isModalSubmit()) {

            if (interaction.customId === "verify_captcha") {

                const command =
                    interaction.client.commands.get("verify");

                if (!command || !command.modal) return;

                try {
                    await command.modal(interaction);
                } catch (error) {
                    console.error(error);

                    if (
                        !interaction.replied &&
                        !interaction.deferred
                    ) {
                        await interaction.reply({
                            content: "Произошла ошибка.",
                            ephemeral: true
                        });
                    }
                }

                return;
            }
        }

        // =====================================================
        // Slash Commands
        // =====================================================

        if (!interaction.isChatInputCommand()) return;

        const command =
            interaction.client.commands.get(
                interaction.commandName
            );

        if (!command) return;

        // ===== Кулдаун =====

        if (!cooldowns.has(command.name)) {
            cooldowns.set(
                command.name,
                new Collection()
            );
        }

        const now = Date.now();

        const timestamps =
            cooldowns.get(command.name);

        const cooldown =
            (command.cooldown || 3) * 1000;

        if (timestamps.has(interaction.user.id)) {

            const expirationTime =
                timestamps.get(interaction.user.id) +
                cooldown;

            if (now < expirationTime) {

                const timeLeft =
                    (
                        (expirationTime - now) /
                        1000
                    ).toFixed(1);

                return interaction.reply({
                    content:
                        `⏳ Подождите **${timeLeft}** сек. перед повторным использованием команды.`,
                    ephemeral: true
                });
            }
        }

        timestamps.set(
            interaction.user.id,
            now
        );

        setTimeout(() => {
            timestamps.delete(
                interaction.user.id
            );
        }, cooldown);

        // ===================

        try {

            await command.execute(
                interaction
            );

        } catch (error) {

            console.error(error);

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.followUp({
                    content: "Произошла ошибка.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content: "Произошла ошибка.",
                    ephemeral: true
                });
            }
        }
    }
};