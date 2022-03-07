module.exports = {
    name: 'test',
    aliases: ['testing'],
    execute(message, args){
        message.channel.send('Congrats, you found a test command');
    }
}