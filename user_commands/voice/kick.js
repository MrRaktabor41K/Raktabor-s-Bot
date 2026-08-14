const {
    SlashCommandBuilder
} = require("discord.js");

const checkVoiceOwner = require("../../utils/checkVoiceOwner");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Выгнать пользователя из комнаты")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Пользователь")
                .setRequired(true)
        ),

    async execute(interaction) {
        const channel =
            await checkVoiceOwner(interaction);

        if (!channel) return;

        const member =
            interaction.options.getMember("user");

        if (!member) {
            return interaction.reply({
                content: "❌ Пользователь не найден.",
                ephemeral: true
            });
        }

        if (!channel.members.has(member.id)) {
            return interaction.reply({
                content: "❌ Пользователь не в комнате.",
                ephemeral: true
            });
        }

        await member.voice.disconnect();

        await interaction.reply({
            content: `🚪 ${member} выгнан.`,
            ephemeral: true
        });
    }
};