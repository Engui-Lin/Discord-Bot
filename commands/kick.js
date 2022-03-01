module.exports = {
    name: 'kick',

    execute(message, args){

        const kicker = message.member;

        if (!kicker.permissions.has('KICK_MEMBERS')){
            return message.reply('You do not have permission to kick members');
        }

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

        if (!target){
            return message.reply('Please specify who you would like to kick');
        }

        const memberTarget = message.guild.members.cache.get(target.id);

        if (!memberTarget.kickable) {
            return message.reply('I cannot kick this person');
        }
        if (target == message.author){
            return message.reply('It\'s not a good idea to kick yourself baka!');
        }
        else if (kicker.roles.highest.comparePositionTo(memberTarget.roles.highest) < 0){
            return message.reply('You do not have enough permission to kick this memeber');
        }
        // else if (message.guild.me.roles.highest.comparePositionTo(memberTarget.roles.highest) < 0){
        //     return message.reply('I do not have enough permission to kick this memeber');
        // }
        else {
            memberTarget.kick();
            return message.channel.send('User has been kicked');
        }
    }
}