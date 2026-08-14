const {
    ChannelType,
    ContainerBuilder,
    MessageFlags,
    PermissionFlagsBits
} = require("discord.js");

const {
    VOICE_CREATE,
    VOICE_CATEGORY_ID
} = require("../config");

const {
    setOwner,
    removeOwner
} = require("../utils/voiceRooms");

module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState) {
        const member = newState.member;

        if (!member) return;

        // ==========================================
        // СОЗДАНИЕ КОМНАТЫ
        // ==========================================

        if (
            newState.channel &&
            newState.channel.id === VOICE_CREATE
        ) {
            const guild = member.guild;

            const category =
                guild.channels.cache.get(
                    VOICE_CATEGORY_ID
                );

            if (!category) {
                console.error(
                    "VOICE_CATEGORY_ID не найден"
                );
                return;
            }

            const newChannel =
                await guild.channels.create({
                    name: `Комната ${member.displayName}`,

                    type: ChannelType.GuildVoice,

                    parent: category.id,

                    permissionOverwrites: [
                        {
                            id: member.id,

                            allow: [
                                PermissionFlagsBits.ManageChannels,
                                PermissionFlagsBits.ManageRoles,
                                PermissionFlagsBits.MoveMembers,
                                PermissionFlagsBits.Connect,
                                PermissionFlagsBits.Speak,
                                PermissionFlagsBits.ViewChannel
                            ]
                        }
                    ]
                });

            // ==========================================
            // ВЛАДЕЛЕЦ
            // ==========================================

            setOwner(
                newChannel.id,
                member.id
            );

            // ==========================================
            // ПЕРЕМЕЩЕНИЕ ПОЛЬЗОВАТЕЛЯ
            // ==========================================

            try {
                await member.voice.setChannel(
                    newChannel
                );
            } catch (error) {
                console.error(
                    "Не удалось переместить пользователя:",
                    error
                );
            }

            // ==========================================
            // CONTAINER
            // ==========================================

            const container =
                new ContainerBuilder()


                    .addTextDisplayComponents(
                        textDisplay =>
                            textDisplay.setContent(
                                "## Управление комнатой"
                            )
                    )

                    .addSeparatorComponents()

                    .addTextDisplayComponents(
                        textDisplay =>
                            textDisplay.setContent(
                                [
                                    "### Доступные команды",
                                    "",
                                    "🔒 `/lock` — закрыть комнату",
                                    "🔓 `/unlock` — открыть комнату",
                                    "👥 `/limit <число>` — установить лимит",
                                    "✏️ `/name <название>` — изменить название",
                                    "🚪 `/kick <user>` — выгнать пользователя",
                                    "👁️ `/hide` — скрыть комнату",
                                    "👁️‍🗨️ `/show` — показать комнату"
                                ].join("\n")
                            )
                    )

                    .addSeparatorComponents()

                    .addTextDisplayComponents(
                        textDisplay =>
                            textDisplay.setContent(
                                `👑 **Владелец:** ${member}`
                            )
                    );

            // ==========================================
            // ОТПРАВКА CONTAINER
            // ==========================================

            try {
                await newChannel.send({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });

            } catch (error) {
                console.error(
                    "Не удалось отправить container:",
                    error
                );
            }
        }

        // ==========================================
        // УДАЛЕНИЕ ПУСТОЙ КОМНАТЫ
        // ==========================================

        if (
            oldState.channel &&
            oldState.channel.id !== newState.channel?.id
        ) {
            const channel = oldState.channel;

            if (
                channel.members.size === 0 &&
                channel.id !== VOICE_CREATE &&
                channel.parentId === VOICE_CATEGORY_ID
            ) {
                removeOwner(channel.id);

                try {
                    await channel.delete();

                } catch (error) {
                    console.error(
                        "Не удалось удалить комнату:",
                        error
                    );
                }
            }
        }
    }
};