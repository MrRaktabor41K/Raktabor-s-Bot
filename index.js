const {Client, GatewayIntentBits, Partials, Collection} = require("discord.js");
const config = require("./config");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction,Partials.ThreadMember]
});

client.commands = new Collection();

function getJSFiles(dir) {
    let files = [];

    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory())
            {if (file === "node_modules" || file.startsWith("."))
                {continue;}
                
            files.push(...getJSFiles(fullPath));

        } else if (file.endsWith(".js")) {files.push(fullPath);}}

    return files;
}



const files = getJSFiles(__dirname);

for (const file of files) {
    const filename = path.basename(file);

    if (filename === "index.js" || filename === "deploy-commands.js") 
        {continue;}


    const relativePath = path.relative(__dirname, file);

    if (relativePath.startsWith(`events${path.sep}`))
        {continue;}

    try {
        const command = require(file);

        if (command.name && typeof command.execute === "function")
            {client.commands.set(command.name.toLowerCase(), command);
            continue;}


        if (command.data?.toJSON) 
            {const data = command.data.toJSON();
            client.commands.set(data.name, command);}} 
            
    catch (error){
        console.error(`❌ Ошибка загрузки команды: ${relativePath}`);
        console.error(error);}}



const eventDir = path.join(__dirname, "events");

if (fs.existsSync(eventDir)){
    const eventFiles = getJSFiles(eventDir);

    for (const file of eventFiles) {
        try {
            const event = require(file);

            if (!event.name || typeof event.execute !== "function") {
                console.warn(`⚠️ Некорректный event: ${path.relative(__dirname, file)}`);
                continue;}

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {client.on(event.name, (...args) => event.execute(...args));}} 
            
            
            
        catch (error) {
            console.error(`❌ Ошибка загрузки события: ${path.relative(__dirname, file)}`);
            console.error(error);}}
}



client.once("ready", () => {console.log(`${client.user.tag} запущен`);
    console.log(`Загружено команд: ${client.commands.size}`);});

client.login(config.token);