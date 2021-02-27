"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dotenv = tslib_1.__importStar(require("dotenv"));
var discord_js_1 = require("discord.js");
var core_1 = require("./modules/utility-belt/core");
var core_2 = require("./modules/headphone/core");
var AtomicAlloy = /** @class */ (function () {
    function AtomicAlloy() {
    }
    AtomicAlloy.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var client, utilityBelt, headPhone;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        AtomicAlloy.beginTheJorney();
                        console.log('[Narrador]: Alloy está sendo iniciada');
                        client = new discord_js_1.Client();
                        return [4 /*yield*/, client.login(process.env.BOT_TOKEN)];
                    case 1:
                        _a.sent();
                        utilityBelt = new core_1.UtilityBelt(client);
                        headPhone = new core_2.HeadPhone(client);
                        utilityBelt.linstenCommands();
                        headPhone.listenCommands();
                        return [2 /*return*/];
                }
            });
        });
    };
    AtomicAlloy.beginTheJorney = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                dotenv.config();
                return [2 /*return*/];
            });
        });
    };
    return AtomicAlloy;
}());
AtomicAlloy.start();
