const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['p', 'pause', 'skip'],

    async execute(message, args, cmd){

        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply('You must be in a voice channel to use this command');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('I do not have permission to connect to this channel');
        if (!permissions.has('SPEAK')) return message.channel.send('I do not have permission to speak to this channel');

        const serverQueue = queue.get(message.guild.id);

        if (cmd == 'play' || cmd == 'p'){
            if (!args.length) return message.reply('Please specify what you want to play');
            let song = {};

            if (ytdl.validateURL(args[0])){
                const songInfo = await ytdl.getInfo(args[0]);
                song = {title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url}
            }
            else {
                const videoFinder = async (query) => {
                    const videoResults = await ytSearch(query);
                    return (videoResults.videos.length > 1) ? videoResults.videos[0] : null;
                }
                const video = await videoFinder(args.join(' '));
                if (video) {
                    song = {title: video.title, url: video.url}
                }
                else {
                    message.channel.send('No results found...');
                }
            }
            if (!serverQueue) {
                const queueConstructor = {
                    voiceChannel: voiceChannel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);
    
                try {
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator,
                    });
                    queueConstructor.connection = connection;
                }
                catch(err) {
                    queue.delete(message.guild.id);
                    console.log('There was an error connecting');
                    throw err;
                }
                try {
                    const audioPlayer = createAudioPlayer({
                        behaviors : {
                            noSubscriber: NoSubscriberBehavior.Pause,
                        },
                    });
                    queueConstructor.audioPlayer = audioPlayer;
                }
                catch(err) {
                    queue.delete(message.guild.id);
                    console.log('There was an error creating audio player');
                    throw err;
                }
                try {
                    videoPlayer(message.guild, queueConstructor.songs[0]);
                }
                catch (err){
                    queue.delete(message.guild.id);
                    console.log('There was an error playing audio');
                    throw err;
                }
            }
            else {  
                serverQueue.songs.push(song);
                return message.channel.send(`**${song.title}**: ${song.url} added to queue`);
            }
        }

        // audioPlayer.on('stateChange', (oldState, newState) => {
        //     console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        //     });

    }
}

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);
    if (!song) {
        queue.delete(guild.id);
        // songQueue.connection.destory();
        return;
    }
    const stream = ytdl(song.url, {filter: 'audioonly'});
    resource = createAudioResource(stream);

    const audioPlayer = createAudioPlayer({
        behaviors : {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    audioPlayer.play(resource);
    songQueue.connection.subscribe(audioPlayer);

    audioPlayer.on(AudioPlayerStatus.Playing,() => {
    const newEmbed = new MessageEmbed()
    .setDescription(`Now playing: [***${song.title}***](${song.url})`)
    songQueue.textChannel.send({embeds: [newEmbed]});
    });

    audioPlayer.on('stateChange', (oldState, newState) => {
        console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        });

    audioPlayer.on(AudioPlayerStatus.Idle, () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });
       
    return;

}