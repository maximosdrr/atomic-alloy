import { Client, Guild, Message } from 'discord.js';
import ytdl from 'ytdl-core';
import { IQueueContruct, ISong } from './types';

export class HeadPhone {
    private volume: number;
    private client: Client;
    private queue = new Map();

    constructor(client: Client, volume = 1) {
        this.client = client;
        this.volume = volume;
    }

    public async listenCommands(): Promise<any> {
        this.client.on('message', async (message: Message) => {
            if (message.author.bot) return;
            if (!message.content.startsWith('@')) return;

            const serverQueue = this.queue.get(message.guild.id);

            if (message.content.startsWith(`@play`)) {
                this.execute(message, serverQueue);
                return;
            } else if (message.content.startsWith(`@skip`)) {
                this.skip(message, serverQueue);
                return;
            } else if (message.content.startsWith(`@stop`)) {
                this.stop(message, serverQueue);
                return;
            }
        });
    }

    private play(guild: Guild, song: ISong): any {
        const serverQueue = this.queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url, { filter: 'audioonly' }))
            .on('finish', () => {
                serverQueue.songs.shift();
                this.play(guild, serverQueue.songs[0]);
            })
            .on('error', (error: any) => console.error(error));

        dispatcher.setVolumeLogarithmic(serverQueue.volume);

        serverQueue.textChannel.send(
            `Vai começar a putaria: **${song.title}**`,
        );
    }

    skip(message: Message, serverQueue: any) {
        if (!message.member.voice.channel)
            return message.channel.send(
                'You have to be in a voice channel to stop the music!',
            );
        if (!serverQueue)
            return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
    }

    stop(message: Message, serverQueue: any) {
        if (!message.member.voice.channel)
            return message.channel.send(
                'You have to be in a voice channel to stop the music!',
            );

        if (!serverQueue)
            return message.channel.send('There is no song that I could stop!');

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }

    private async execute(message: Message, serverQueue: any): Promise<any> {
        const args = message.content.split(' ');

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return message.channel.send(
                'Você deve estar em um canal pra conectar o bot, preto fodido',
            );

        const permissions = voiceChannel.permissionsFor(message.client.user);

        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send(
                'Porra, eu preciso de permissão pra poder fazer alguma coisa aqui!',
            );
        }

        const songInfo = await ytdl.getInfo(args[1]);

        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (!serverQueue) {
            const queueConstruct: IQueueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                playing: true,
                volume: this.volume,
                songs: [],
            };

            this.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                this.play(message.guild, queueConstruct.songs[0]);
            } catch (e) {
                console.log(e);
                this.queue.delete(message.guild.id);
                return message.channel.send(e);
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} já esta na lista`);
        }
    }
}
