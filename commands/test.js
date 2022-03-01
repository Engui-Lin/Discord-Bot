module.exports = {
    name: 'test',
    execute(message, args){
        message.channel.send('Congrats, you found a test command');
    }
}