const {
    SlashCommandBuilder
} = require("discord.js");

const checkVoiceOwner = require("../../utils/checkVoiceOwner");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("name")
        .setDescription("Изменить название комнаты")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Новое название")
                .setRequired(true)
                .setMaxLength(100)
        ),

    async execute(interaction) {
        const channel =
            await checkVoiceOwner(interaction);

        if (!channel) return;

        const name =
            interaction.options.getString("name");

        await channel.setName(name);

        await interaction.reply({
            content: `✏️ Новое название: ${name}`,
            ephemeral: true
        });
    }
};