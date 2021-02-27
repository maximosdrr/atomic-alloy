import { Client } from 'discord.js';

export class UtilityBelt {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    linstenCommands(): void {
        this.verifyPing();
        this.seuMadruga();
    }

    verifyPing(): void {
        this.client.on('message', (message) => {
            if (message.content == '@ping') {
                message.channel.send(
                    `Latencia: ${
                        Math.round(this.client.ws.ping) -
                        (Date.now() - message.createdTimestamp)
                    } ms`,
                );
            }
        });
    }

    seuMadruga(): void {
        this.client.on('message', (message) => {
            if (message.content == 'seu madruga') {
                message.channel.send('**Seu madruga uma porra homi**');
            }
        });
    }
}
