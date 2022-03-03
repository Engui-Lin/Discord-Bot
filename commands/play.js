const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

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
        
        // const validURL = (str) => {
        //     var regex = /(http|https):\/\/(w+:{0,1}\w*)?
        // }
        
        
        const video = await videoFinder(args.join(' '));

        if (video) {

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
    
            const audioPlayer = createAudioPlayer({
                behaviors : {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            
            const stream = await ytdl(video.url, {filter: 'audioonly'});

            const resource = createAudioResource(stream);

            audioPlayer.play(resource);
            connection.subscribe(audioPlayer);
            
            const newEmbed = new MessageEmbed()
            .setDescription(`Now playing: [***${video.title}***](${video.url})`)
            message.channel.send({embeds: [newEmbed]});
            
            // connection.on('stateChange', (oldState, newState) => {
            //     console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
            //     });
            audioPlayer.on('stateChange', (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
                });

            audioPlayer.on('idle', () => {
                setTimeout(()=>{
                    if (audioPlayer.state.status == 'idle'){
                        console.log('idle starts........')
                        connection.destroy();
                        console.log('Disconnected from voice channel...');
                    }
                    }, 60000);
                });
        }
        else{
            message.channel.send('No results found...');
        } 
    }
}