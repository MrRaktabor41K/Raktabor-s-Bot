const {
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const {
    createRulesContainer
} = require("../utils/rulesContainer");

module.exports = {
    name: "rule",

    async execute(message) {
        if (
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content: "❌ У вас нет прав администратора."
            });
        }

        const container = createRulesContainer();

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};