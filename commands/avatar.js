const { MessageEmbed } = require('discord.js');

module.exports = {

    name: 'avatar',
    
    execute(message, args){

        var member = message.mentions.users.first();

        if (!member) member = message.author;

        const newEmbed = new MessageEmbed()
        .setTitle(member.tag)
        .setImage(member.displayAvatarURL({size: 512}));
        message.channel.send({embeds: [newEmbed]});
    }
}