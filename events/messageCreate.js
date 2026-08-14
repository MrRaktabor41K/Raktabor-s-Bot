module.exports = {
    name: "messageCreate",

    async execute(message) {
        if (message.author.bot) return;

        if (!message.content.startsWith("!")) {
            return;
        }

        const args = message.content
            .slice(1)
            .trim()
            .split(/\s+/);

        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command =
            message.client.commands.get(commandName);

        if (!command) {
            console.log(
                `Команда !${commandName} не найдена.`
            );

            return;
        }

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(
                `Ошибка при выполнении !${commandName}:`,
                error
            );

            await message.reply({
                content: "❌ Произошла ошибка."
            });
        }
    }
};