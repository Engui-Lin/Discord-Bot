module.exports = {
    name: 'ban',

    execute(message, args){

        const kicker = message.member;

        if (!kicker.permissions.has('BAN_MEMBERS')){
            return message.reply('You do not have permission to ban members');
        }

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

        if (!target){
            return message.reply('Please specify who you would like to ban');
        }

        const memberTarget = message.guild.members.cache.get(target.id);

        if (target == message.author){
            return message.reply('It\'s not a good idea to ban yourself baka!');
        }
        else if (kicker.roles.highest.comparePositionTo(memberTarget.roles.highest) < 0){
            return message.reply('You do not have enough permission to ban this memeber');
        }
        else if (!target.kickable) {
            return message.reply('I cannot ban this person');
        }
        else {
            memberTarget.kick();
            return  message.channel.send('User has been banned');
        }
    }
}