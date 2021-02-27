"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadPhone = void 0;
var tslib_1 = require("tslib");
var ytdl_core_1 = tslib_1.__importDefault(require("ytdl-core"));
var HeadPhone = /** @class */ (function () {
    function HeadPhone(client, volume) {
        if (volume === void 0) { volume = 1; }
        this.queue = new Map();
        this.client = client;
        this.volume = volume;
    }
    HeadPhone.prototype.listenCommands = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.client.on('message', function (message) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var serverQueue;
                    return tslib_1.__generator(this, function (_a) {
                        if (message.author.bot)
                            return [2 /*return*/];
                        if (!message.content.startsWith('@'))
                            return [2 /*return*/];
                        serverQueue = this.queue.get(message.guild.id);
                        if (message.content.startsWith("@play")) {
                            this.execute(message, serverQueue);
                            return [2 /*return*/];
                        }
                        else if (message.content.startsWith("@skip")) {
                            this.skip(message, serverQueue);
                            return [2 /*return*/];
                        }
                        else if (message.content.startsWith("@stop")) {
                            this.stop(message, serverQueue);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    HeadPhone.prototype.play = function (guild, song) {
        var _this = this;
        var serverQueue = this.queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queue.delete(guild.id);
            return;
        }
        var dispatcher = serverQueue.connection
            .play(ytdl_core_1.default(song.url, { filter: 'audioonly' }))
            .on('finish', function () {
            serverQueue.songs.shift();
            _this.play(guild, serverQueue.songs[0]);
        })
            .on('error', function (error) { return console.error(error); });
        dispatcher.setVolumeLogarithmic(serverQueue.volume);
        serverQueue.textChannel.send("Vai come\u00E7ar a putaria: **" + song.title + "**");
    };
    HeadPhone.prototype.skip = function (message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue)
            return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
    };
    HeadPhone.prototype.stop = function (message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue)
            return message.channel.send('There is no song that I could stop!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    };
    HeadPhone.prototype.execute = function (message, serverQueue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var args, voiceChannel, permissions, songInfo, song, queueConstruct, connection, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = message.content.split(' ');
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send('Você deve estar em um canal pra conectar o bot, preto fodido')];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                            return [2 /*return*/, message.channel.send('Porra, eu preciso de permissão pra poder fazer alguma coisa aqui!')];
                        }
                        return [4 /*yield*/, ytdl_core_1.default.getInfo(args[1])];
                    case 1:
                        songInfo = _a.sent();
                        song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                        };
                        if (!!serverQueue) return [3 /*break*/, 6];
                        queueConstruct = {
                            textChannel: message.channel,
                            voiceChannel: voiceChannel,
                            connection: null,
                            playing: true,
                            volume: this.volume,
                            songs: [],
                        };
                        this.queue.set(message.guild.id, queueConstruct);
                        queueConstruct.songs.push(song);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, voiceChannel.join()];
                    case 3:
                        connection = _a.sent();
                        queueConstruct.connection = connection;
                        this.play(message.guild, queueConstruct.songs[0]);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        this.queue.delete(message.guild.id);
                        return [2 /*return*/, message.channel.send(e_1)];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        serverQueue.songs.push(song);
                        return [2 /*return*/, message.channel.send(song.title + " j\u00E1 esta na lista")];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return HeadPhone;
}());
exports.HeadPhone = HeadPhone;
