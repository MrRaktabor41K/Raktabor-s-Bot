const {
    Events
} = require("discord.js");

const config = require("../config");

module.exports = {
    name: Events.MessageReactionAdd,

    async execute(reaction, user) {
        try {
            if (user.bot) return;

            // Загружаем partial reaction
            if (reaction.partial) {
                await reaction.fetch();
            }

            const message = reaction.message;

            // Только нужный канал
            if (message.channel.id !== config.REACTION_ROLE_CHANNEL_ID) {
                return;
            }

            const emoji = reaction.emoji.name;

            // Ищем роль для этой реакции
            const roleId = config.REACTION_ROLES[emoji];

            if (!roleId) {
                return;
            }

            const guild = message.guild;

            if (!guild) return;

            // Получаем участника
            const member = await guild.members.fetch(user.id);

            // Получаем роль
            const role = guild.roles.cache.get(roleId);

            if (!role) {
                console.error(
                    `❌ Роль не найдена: ${roleId}`
                );
                return;
            }

            // Проверяем позицию роли бота
            const botMember = guild.members.me;

            if (!botMember) {
                console.error("❌ Не удалось получить бота на сервере");
                return;
            }

            if (role.position >= botMember.roles.highest.position) {
                console.error(
                    `❌ Бот не может выдать роль "${role.name}". ` +
                    `Роль бота должна быть выше этой роли.`
                );
                return;
            }

            // Уже есть
            if (member.roles.cache.has(roleId)) {
                return;
            }

            await member.roles.add(role);

            console.log(
                `✅ ${user.tag} получил роль "${role.name}" за ${emoji}`
            );

        } catch (error) {
            console.error(
                "❌ Ошибка MessageReactionAdd:"
            );

            console.error(error);
        }
    }
};