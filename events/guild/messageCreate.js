module.exports = (client, message) => {
    const prefix = '.';
    
    if (message.mentions.users.first() == client.user){
        message.channel.send(`prefix: '${prefix}'`);
    } 
    else if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (command) command.execute(message, args, cmd);

}