export interface ISong {
    title: string;
    url: string;
}

export interface IQueueContruct {
    textChannel: any;
    voiceChannel: any;
    connection: any;
    songs: ISong[];
    volume: number;
    playing: boolean;
}
