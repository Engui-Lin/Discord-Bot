module.exports = {
    name: 'test',
    execute(message, args){
        message.channel.send('This is a test command');
    }
}