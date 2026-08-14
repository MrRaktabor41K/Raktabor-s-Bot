const {
    Events,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    MessageFlags
} = require('discord.js');

const { START_ROLE, HELLO_CHANNEL } = require('../config');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {
        try {
            const role = member.guild.roles.cache.get(START_ROLE);
            const channel = member.guild.channels.cache.get(HELLO_CHANNEL);

            if (!channel) return;

            if (role) {
                await member.roles.add(role).catch(console.error);
            }

            const date = new Date().toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const container = new ContainerBuilder()

                // Приветствие + аватар
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                `# Добро пожаловать!\n` +
                                `## ${member.user.displayName}`

                            )
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder({
                                media: {
                                    url: member.displayAvatarURL({
                                        extension: 'png',
                                        size: 256
                                    })
                                }
                            })
                        )
                )

                .addSeparatorComponents(
                    new SeparatorBuilder()
                )

                // Небольшая информация
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `### ✦ Что дальше?\n` +
                        `Рады видеть тебя на **${member.guild.name}**.\n` +
                        `Надеемся, тебе здесь понравится.\n` +
                        `Ознакомься с правилами сервера и присоединяйся к общению.\n` +
                        `**Не стесняйся писать.** Здесь всегда рады новым участникам.\n`
                    )
                )

                .addSeparatorComponents(
                    new SeparatorBuilder()
                )

                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `*Добро пожаловать в наше сообщество ✦*`
                    )
                );

            await channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('[HELLO] Ошибка при приветствии:', error);
        }
    }
};