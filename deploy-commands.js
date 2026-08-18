const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const config = require("./config");

const commands = new Map();

function getJSFiles(dir) {
  let files = [];

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file === "node_modules" || file.startsWith(".")) {
        continue;
      }

      files.push(...getJSFiles(fullPath));
    } else if (
      file.endsWith(".js") &&
      file !== "index.js" &&
      file !== "deploy-commands.js"
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = getJSFiles(__dirname);

for (const file of files) {
  try {
    const command = require(file);

    if (command.data?.toJSON) {
      const commandData = command.data.toJSON();

      // Если команда уже существует — не добавляем повторно
      if (commands.has(commandData.name)) {
        continue;
      }

      commands.set(commandData.name, commandData);
    }
  } catch (error) {
    console.error(`Ошибка загрузки: ${path.relative(__dirname, file)}`);

    console.error(error);
  }
}

const commandList = [...commands.values()];

const rest = new REST({
  version: "10",
}).setToken(config.token);

(async () => {
  try {
    // Удаляем ВСЕ старые глобальные команды
    console.log("Очистка глобальных команд...");

    await rest.put(Routes.applicationCommands(config.clientId), {
      body: [],
    });

    console.log("Глобальные команды очищены.");

    // Загружаем команды на конкретный сервер
    console.log(`Синхронизация ${commandList.length} команд на сервер...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      {
        body: commandList,
      },
    );

    console.log(`Синхронизировано: ${data.length}`);
  } catch (error) {
    console.error(error);
  }
})();
