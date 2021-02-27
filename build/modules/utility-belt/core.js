"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityBelt = void 0;
var UtilityBelt = /** @class */ (function () {
    function UtilityBelt(client) {
        this.client = client;
    }
    UtilityBelt.prototype.linstenCommands = function () {
        this.verifyPing();
        this.seuMadruga();
    };
    UtilityBelt.prototype.verifyPing = function () {
        var _this = this;
        this.client.on('message', function (message) {
            if (message.content == '@ping') {
                message.channel.send("Latencia: " + (Math.round(_this.client.ws.ping) -
                    (Date.now() - message.createdTimestamp)) + " ms");
            }
        });
    };
    UtilityBelt.prototype.seuMadruga = function () {
        this.client.on('message', function (message) {
            if (message.content == 'seu madruga') {
                message.channel.send('**Seu madruga uma porra homi**');
            }
        });
    };
    return UtilityBelt;
}());
exports.UtilityBelt = UtilityBelt;
