const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',

    async execute(message, args){
        const voiceChannel = message.member.voice.channel;
        
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel');
        
        const connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) return message.channel.send('Not currently in a voice channel');
        else await connection.destroy();
    }
}