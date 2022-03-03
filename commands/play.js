const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    name: 'play',

    async execute(message, args){
        
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.reply('You must be in a voice channel to use this command');
        
        const permissions = voiceChannel.permissionsFor(message.client.user);

        if (!permissions.has('CONNECT')) return message.channel.send('I do not have permission to connect to this channel');
        if (!permissions.has('SPEAK')) return message.channel.send('I do not have permission to speak to this channel');

        if (!args.length) return message.reply('Please specify what you want to play');

        const videoFinder = async (query) => {
            const videoResults = await ytSearch(query);
            return (videoResults.videos.length > 1) ? videoResults.videos[0] : null;
        }
        
        const video = await videoFinder(args.join(' '));

        if (video) {

            const connection = await joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
    
            const audioPlayer = createAudioPlayer();

            const stream = await ytdl(video.url, {filter: 'audioonly'});

            const testT = createAudioResource(stream);

            audioPlayer.play(testT);
            connection.subscribe(audioPlayer);

            // connection.on('stateChange', (oldState, newState) => {
            //     console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
            //     });
            audioPlayer.on('stateChange', (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
                });
            console.log("Bot's up and runnin'!");

        }
    }
}