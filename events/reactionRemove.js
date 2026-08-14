const {
    Events
} = require("discord.js");

const config = require("../config");

module.exports = {
    name: Events.MessageReactionRemove,

    async execute(reaction, user) {
        try {
            if (user.bot) return;

            if (reaction.partial) {
                await reaction.fetch();
            }

            const message = reaction.message;

            if (
                message.channel.id !==
                config.REACTION_ROLE_CHANNEL_ID
            ) {
                return;
            }

            const emoji = reaction.emoji.name;
            const roleId = config.REACTION_ROLES[emoji];

            if (!roleId) return;

            const guild = message.guild;

            if (!guild) return;

            const member = await guild.members.fetch(user.id);

            if (!member.roles.cache.has(roleId)) {
                return;
            }

            const role = guild.roles.cache.get(roleId);

            if (!role) return;

            await member.roles.remove(role);

            console.log(
                `❌ ${user.tag} потерял роль "${role.name}" за ${emoji}`
            );

        } catch (error) {
            console.error(
                "❌ Ошибка MessageReactionRemove:"
            );

            console.error(error);
        }
    }
};