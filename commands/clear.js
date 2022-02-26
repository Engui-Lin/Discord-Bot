module.exports = {

    name: 'clear',
    
    async execute(message, args) {

        if (message.author.bot || !message.member.permissions.has('MANAGE_MESSAGES')) 
            return message.reply('You do not have permission to delete messages');

        if (!args[0])  return message.reply('Please enter the amount of messages you to clear!');
        if (isNaN(args[0])) return message.reply('Please enter a real number');
        if (args[0] > 40) return message.reply('You can\'t delete more than 40 messages');
        if (args[0] < 1) return message.reply('Please enter a positive number');

        await message.channel.messages.fetch({limit : Number(args[0])+1}).then(messages => {
            message.channel.bulkDelete(messages);
            message.channel.send(args[0] + ' message(s) deleted').then(tempAlert => {
                setTimeout(() => tempAlert.delete(), 500);
            });
        });

    }
}