const {
    isOwner
} = require("./voiceRooms");

async function checkVoiceOwner(interaction) {
    const member = interaction.member;

    // Пользователь не находится в voice
    if (!member.voice.channel) {
        await interaction.reply({
            content: "❌ Ты не в голосовом канале.",
            ephemeral: true
        });

        return null;
    }

    const channel = member.voice.channel;

    // Пользователь не владелец
    if (!isOwner(channel.id, member.id)) {
        await interaction.reply({
            content: "❌ Ты не владелец комнаты.",
            ephemeral: true
        });

        return null;
    }

    return channel;
}

module.exports = checkVoiceOwner;