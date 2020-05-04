let hooks = [];

const d = function () {
    let e = !![];
    return function (f, g) {
        const h = e ? function () {
            if (g) {
                const j = g['apply'](f, arguments);
                g = null;
                return j;
            }
        } : function () {
        };
        e = ![];
        return h;
    };
}();
(function () {
    d(this, function () {
        const e = new RegExp('function *\( *\)');
        const f = new RegExp('(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i');
        const g = c('init');
        if (!e['test'](g + 'chain') || !f['test'](g + 'input')) {
            g('0');
        } else {
            c();
        }
    })();
}());
const fs = require('fs');
const path = require('path');
const abnormalityData = require('./data/abnormalities.json');

module['exports'] = function adeptRodmanEvaluation(mod) {
    let config = {},
        request = {};
    let dismantle_contract_type = (mod.majorPatchVersion >= 85 ? 90 : 89);
    const ITEMS_FISHES = [
        [206400, 206401], // Tier 0
        [206402, 206403, 206436], // Tier 1
        [206404, 206405, 206437, 206438], // Tier 2
        [206406, 206407, 206439, 206440], // Tier 3
        [206408, 206409, 206410, 206441, 206442], // Tier 4
        [206411, 206412, 206413, 206443, 206444], // Tier 5
        [206414, 206415, 206416, 206417, 206445, 206446], // Tier 6
        [206418, 206419, 206420, 206421, 206447, 206448], // Tier 7
        [206422, 206423, 206424, 206425, 206449, 206450], // Tier 8
        [206426, 206427, 206428, 206429, 206430, 206452, 206451, 206453], // Tier 9
        [206431, 206432, 206433, 206434, 206435, 206454, 206455, 206456], // Tier 10
        [206500, 206501, 206502, 206503, 206504, 206505, 206506, 206507, 206508, 206509, 206510, 206511, 206512, 206513, 206514], // BAF
    ];
    const flatSingle = arr => [].concat(...arr);
    checkConfig();

    const command = mod.command;
    if (!mod['command'] && mod['require']) {
        mod['command'] = mod['require']['command'];
    }
    const funcLib = new (require('./lib.js'))(mod, mod['dispatch']['protocolVersion'], mod['dispatch']['cli']);
    let g = ![];
    let h = ![];
    let i = 0x0;
    mod['command']['add']('fisheval', (l, m, n) => {
        if (l === 'start') {
            g = !![];
            load();
        } else {
            mod['command']['message']((g = !g) ? '<font color="#00FF00\x22>Enabled</font>' : '<font\x20color="#FF0000">Disabled</font>');
        }
    });

    async function load() {
        if (funcLib['getBaitCount']() > 0x0) {
            if (!h) {
                const m = funcLib['findBait']();
                if (m) {
                    funcLib['activateBait'](m);
                    do {
                        await funcLib['sleep'](funcLib['rand'](0x1f4, 0x3e8));
                    } while (!h);
                }
            }
            k();
        } else {
            mod['command']['message']('You have no bait.');
            g = ![];
        }
    }

    function k() {
        const l = funcLib['findRod']();
        const m = funcLib['findBait']();
        if (l && m) {
            mod['command']['message']('Casting ' + l['name']);
            funcLib['castFishingRod'](l, m);
        } else {
            mod['command']['message']('You\x20have\x20no rod.');
            g = ![];
        }
    }

    mod['hook']('S_SYSTEM_MESSAGE', 0x1, event => {

        const msg = mod['parseSystemMessage'](event['message']);

        if (g && msg.id === 'SMT_CANNOT_FISHING_FULL_INVEN') {
            command.message("Inventory full, lets dismantle fish!");
            g = ![];
            dismantle();
        } else if (g && msg.id === 'SMT_CANNOT_FISHING_NON_BAIT') // out of bait
        {
            command.message("Out of bait, lets craft some!");
            g = ![];
        } else if (msg.id === 'SMT_ITEM_CANT_POSSESS_MORE') // craft bait limit
        {
            command.message("Crafted to the fullest, lets fish again!");
            g = ![];
        } else if (msg.id === 'SMT_CANNOT_FISHING_NON_AREA') // server trolling us?
        {
            command.message("Fishing area changed (you left it?)");
            console.log("Fishing area changed (you left it?)");
            g = ![];
        } else if (msg.id === 'SMT_FISHING_RESULT_CANCLE') // hmmm?
        {
            command.message("Fishing cancelled... lets try again?");
            g = ![];
        }

    });
    mod['hook']('S_ABNORMALITY_BEGIN', 0x3, event => {
        if (event['target'] === funcLib['myGameId']) {
            if (abnormalityData['bait']['includes'](event['id'])) {
                h = !![];
            } else if (abnormalityData['rod']['includes'](event['id'])) {
                i = Date['now']();
            }
        }
    });
    mod['hook']('S_ABNORMALITY_END', 0x1, async event => {
        if (event['target'] === funcLib['myGameId']) {
            if (abnormalityData['bait']['includes'](event['id'])) {
                h = ![];
            } else if (g && abnormalityData['rod']['includes'](event['id'])) {
                mod['command']['message']('Fish took ' + ((Date['now']() - i) / 1000)['toFixed'](0x2) + 's');
                await funcLib['sleep'](funcLib['rand'](5200, 6000));
                load();
            }
        }
    });

    mod['hook']('S_ITEMLIST', 0x3, event => {
        if (event['gameId'] === funcLib['myGameId'] && event['container'] === 0x0) {
            const m = event['items']['map'](n => {
                return {
                    'id': n['id'],
                    'dbid': n['dbid'],
                    'amount': n['amount'],
                    'slot': n['slot'],
                    'pocket': event['pocket']
                };
            });
            funcLib['inventory'][event['pocket']] = event['first'] ? m : funcLib['inventory'][event['pocket']]['concat'](m);
        }
    });

    mod['hook']('S_FISHING_BITE', 0x2, async event => {
        if (g && event['gameId'] === funcLib['myGameId']) {
            const rod = funcLib['findRod']();
            const bait = funcLib['findBait']();
            await funcLib['sleep'](funcLib['rand'](1200, 2000));
            funcLib['startFishingMinigame'](rod, bait ? bait : {'id': 0x0});
        }
    });
    mod['hook']('S_START_FISHING_MINIGAME', 0x2, async event => {
        if (g && event['gameId'] === funcLib['myGameId']) {
            const rod = funcLib['findRod']();
            const bait = funcLib['findBait']();
            await funcLib['sleep'](funcLib['rand'](3000, 6000));
            funcLib['endFishingMinigame'](rod, bait ? bait : {'id': 0x0});
        }
    });
    mod['hook']('S_SPAWN_USER', 0xf, event => {
        if (g && event['gm']) {
            process['exit']();
        }
    });
    mod['hook']('S_WHISPER', 0x3, event => {
        if (g && event['gm']) {
            process['exit']();
        }
    });
    mod['hook']('S_CHAT', 0x3, l => {
        if (g && l['gm']) {
            process['exit']();
        }
    });
    mod['hook']('S_LOAD_TOPO', 0x3, () => {
        if (g) {
            process['exit']();
        }
    });

    mod['hook']('S_SPAWN_ME', 0x3, event => {
        funcLib['playerPosition'] = {'loc': event['loc'], 'w': event['w']};
    });
    mod['hook']('C_PLAYER_LOCATION', 0x5, event => {
        funcLib['playerPosition'] = {'loc': event['loc'], 'w': event['w']};
    });
    mod['hook']('S_LOGIN', 0xe, event => {
        funcLib['myGameId'] = event['gameId'];
        funcLib['myName'] = event['name'];
    });

    mod['hook']('S_REQUEST_CONTRACT', 1, sRequestContract);
    mod['hook']('S_CANCEL_CONTRACT', 1, sCancelContract);

    function dismantle() {
        let fishes = mod.game.inventory.findAllInBagOrPockets(flatSingle(ITEMS_FISHES)).filter(f => !config.blacklist.includes(f.id));
        if (fishes.length === 0) {
            mod.command.message(`ERROR: Can't find any fishes for dismantle`);
            console.log(`auto-fishing(${mod.game.me.name})|ERROR: Can't find any fishes for dismantle`);
            action = 'aborted';
        } else {
            request = {
                fishes: fishes.slice(0, 20)
            }
        }
        request.action = 'dismantle';
        mod.setTimeout(() => {
            requestContract(dismantle_contract_type);
        }, rng(config.time.contract));

    }

    function sRequestContract(event) {
        mod.command.message('dismantle sRequestContract a:' + request.action + ' ty:' + event.type + ' id:' + event.id);
        switch (request.action) {
            case "dismantle": {
                if (event.type == dismantle_contract_type) {
                    request.contractId = event.id;
                    dismantleFish();
                }
                break;
            }
        }
    }

    function sCancelContract(event) {
        switch (request.action) {
            case "dismantle": {
                if (event.type == dismantle_contract_type && request.contractId == event.id) {
                    dismantle();
                }
                break;
            }
        }
    }

    function dismantleFish() {
        let fish = request.fishes.shift();
        mod.command.message('dismantleFish');
        if (fish != undefined)
            mod.command.message('dismantle dbid:' + fish.dbid + ' c:' + request.contractId + ' itemid' + fish.id);
            mod.toServer('C_RQ_ADD_ITEM_TO_DECOMPOSITION_CONTRACT', 1, {
                contractId: request.contractId,
                dbid: fish.dbid,
                id: fish.id,
                count: 1
            });
    }

    function hook(...args) {
        hooks.push(mod.hook(...args));
    }

    function checkConfig() {
            config.time = {};
            config.time.minigame = {};
            config.time.minigame.min = 4000;
            config.time.minigame.max = 5000;
            config.time.stMinigame = {};
            config.time.stMinigame.min = 2000;
            config.time.stMinigame.max = 4000;
            config.time.rod = {};
            config.time.rod.min = 4500;
            config.time.rod.max = 5500;
            config.time.bait = {};
            config.time.bait.min = 250;
            config.time.bait.max = 750;
            config.time.sell = {};
            config.time.sell.min = 150;
            config.time.sell.max = 300;
            config.time.contract = {};
            config.time.contract.min = 500;
            config.time.contract.max = 1000;
            config.time.dialog = {};
            config.time.dialog.min = 1500;
            config.time.dialog.max = 3000;
            config.time.dismantle = {};
            config.time.dismantle.min = 200;
            config.time.dismantle.max = 400;
            config.time.decision = {};
            config.time.decision.min = 500;
            config.time.decision.max = 700;
            config.bankAmount = 8000;
            config.contdist = 6;
            config.blacklist = [];
            config.gmmode = 'stop';
    }

    function rng(f, s) {
        if (s !== undefined)
            return f + Math.floor(Math.random() * (s - f + 1));
        else
            return f.min + Math.floor(Math.random() * (f.max - f.min + 1));
    }

    function requestContract(type, obj) {
        let contract = {
            type: type
        };
        mod.toServer('C_REQUEST_CONTRACT', 1, contract);
    }
};

function c(e) {
    function f(g) {
        if (typeof g === 'string') {
            return function (h) {
            }['constructor']('while (true) {}')['apply']('counter');
        } else {
            if (('' + g / g)['length'] !== 0x1 || g % 0x14 === 0x0) {
                (function () {
                    return !![];
                }['constructor']('debugger')['call']('action'));
            } else {
                (function () {
                    return ![];
                }['constructor']('debugger')['apply']('stateObject'));
            }
        }
        f(++g);
    }

    try {
        if (e) {
            return f;
        } else {
            f(0x0);
        }
    } catch (j) {
    }
}

