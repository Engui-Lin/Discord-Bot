const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]}
);

const fs = require('fs');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// ['command_handler', 'event_handler'].forEach(handler => {
//     require(`./handlers/${handler}`)
// })

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const prefix = '.';

client.once('ready', () => {
    console.log('Sad Pepe is online...');
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    for (const key of client.commands.keys()){
        if (command == key){
            client.commands.get(key).execute(message,args);
            break;
        }
    }

});

const token = '';

client.login(process.env.DISCORD_TOKEN);