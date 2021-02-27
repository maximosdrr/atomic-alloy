import * as dotenv from 'dotenv';
import { Client } from 'discord.js';
import { UtilityBelt } from './modules/utility-belt/core';
import { HeadPhone } from './modules/headphone/core';

class AtomicAlloy {
    public static async start(): Promise<void> {
        AtomicAlloy.beginTheJorney();

        console.log('[Narrador]: Alloy está sendo iniciada');
        const client = new Client();
        await client.login(process.env.BOT_TOKEN);

        //CORE
        const utilityBelt: UtilityBelt = new UtilityBelt(client);
        const headPhone: HeadPhone = new HeadPhone(client);

        utilityBelt.linstenCommands();
        headPhone.listenCommands();
    }

    public static async beginTheJorney() {
        dotenv.config();
    }
}

AtomicAlloy.start();
