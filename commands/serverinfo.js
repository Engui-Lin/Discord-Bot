const { MessageEmbed } = require('discord.js');

module.exports = {

    name : 'serverinfo',

    async execute(message, args) {

        const guild = message.guild
        await guild.fetchOwner().then(guildMember => owner = guildMember)

        const creationDate = guild.createdAt;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday'];
        
        await guild.emojis.fetch().then(emojiCache => emojis = emojiCache);

        const channels = guild.channels.cache;
        var textChannel = 0;
        var voiceChannel = 0;
        var categoryChannel = 0;
        var stageChannel = 0;

        for (const key of channels.keys()){
            switch (channels.get(key).type){
                case 'GUILD_TEXT': textChannel++; break;
                case 'GUILD_VOICE': voiceChannel++; break;
                case 'GUILD_CATEGORY': categoryChannel++; break;
                case 'GUILD_STAGE_VOICE': stageChannel++; break;
            }
        }

        const newEmbed = new MessageEmbed()
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL())
        .setDescription(`
        Server ID: ${guild.id}
        Owner: ${owner.user.tag}
        Members: ${guild.memberCount}  |  Emojis: ${emojis.size}
        Created: ${days[creationDate.getDay()]}, ${months[creationDate.getMonth()]} ${creationDate.getDate()}, ${creationDate.getFullYear()}
        Boosts: ${guild.premiumSubscriptionCount}
        Channels: Text: ${textChannel} | Voice: ${voiceChannel} | Stage: ${stageChannel} | Categories: ${categoryChannel}

        `)

        message.channel.send({embeds: [newEmbed]});
    }
}