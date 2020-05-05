

const d = function () {
    let e = true;
    return function (f, g) {
        const h = e ? function () {
            if (g) {
                const j = g['apply'](f, arguments);
                g = null;
                return j;
            }
        } : function () {
        };
        e = false;
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

module['exports'] = function GigaFish(mod) {

    mod.game.initialize('inventory');
    let hooks = [];
    let config = {},
        idleCheckTimer = null,
        request = {};
    let DEBUG = false;
    let dismantle_contract_type = 90;
    const FILET_ID = 204052;
    const BAITS = {
        70271: 206000, // Bait I 0%
        70272: 206001, // Bait II 20%
        70273: 206002, // Bait III 40%
        70274: 206003, // Bait IV 60%
        70275: 206004, // Bait V 80%
        70365: 206905, // Dappled Bait 80% + 5%
        70364: 206904, // Rainbow Bait 80% + 10%
        70363: 206903, // Mechanical Worm 80% + 15%
        70362: 206902, // Enhanced Mechanical Worm 80% + 20%
        70361: 206901, // Popo Bait 80% + 25%
        70360: 206900, // Popori Bait 80% + 30%
        70281: 206005, // Red Angleworm 0%
        70282: 206006, // Green Angleworm 20%
        70283: 206007, // Blue Angleworm 40%
        70284: 206008, // Purple Angleworm 60%
        70285: 206009, // Golden Angleworm 80%
        70286: 206828, // Celisium Fragment Bait
        70379: 143188, // Event Bait I
        5000012: 143188, // Event Bait II,
        5060038: 856470, // ICEFISH BAIT
        70276: 206053,// Pilidium Bait, remove from inv and bag all others baits
        70371: 209189 // Event Shark Bait - can only be used at Murcai Fishery
    };
    const ITEMS_SALAD = [206020, 206040];
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
        // [206500, 206501, 206502, 206503, 206504, 206505, 206506, 206507, 206508, 206509, 206510, 206511, 206512, 206513, 206514], // BAF
    ];
    //stat
    let statistic = [],
        startTime = null,
        endTime = null,
        lastLevel = null;
    //end stat
    const flatSingle = arr => [].concat(...arr);

    checkConfig();

    const command = mod.command;
    if (!mod.command && mod.require) {
        mod.command = mod.require.command;
    }
    const funcLib = new (require('./lib.js'))(mod, mod['dispatch']['protocolVersion'], mod['dispatch']['cli']);
    let enableFishing = false;
    let activeRod,
        activeBait;
    let toggleBait = false;
    let i = 0;
    let counterDismantle = 0;

    //region Command
    mod.command.add('gigafish', (key, arg, arg2) => {
        switch (key) {
            case 'enable':
                toggleHooks();
                mod.command.message(enableFishing ? '<font color="#00FF00">Enabled</font>' : '<font color="#FF0000">Disabled</font>');
                mod.command.message('Manually start fishing now.');
                break;
            case 'start':
                if (enableFishing) {
                    statistic = [], startTime = null, endTime = null, lastLevel = null;
                } else {
                    toggleHooks();
                }
                mod.command.message((enableFishing = !enableFishing) ? '<font color="#00FF00">Enabled</font>' : '<font color="#FF0000">Disabled</font>');
                mod.command.message('Trying to fish.');
                load();
                break;
            case 'stop':case 'disable':
                if (enableFishing) {
                    toggleHooks();
                    mod.command.message('<font color="#FF0000">Disabled</font>');
                } else {
                    mod.command.message('Already disabled');
                }
                break;
            case 'debug':
                DEBUG = !DEBUG;
                mod.command.message('Debug mode has been ' + (DEBUG ? 'en' : 'dis') + 'abled.');
                break;
            case 'dismantle':case 'dismant':
                if (enableFishing) {
                    request.action = 'dismantle';
                    makeDecision('dismantle');
                } else {
                    mod.command.message('First enable');
                }
                break;
            default:
                mod.command.message('Incorrect command, use start/stop/debug');
                break;
        }
    });
    //endregion

    async function load() {
        if (funcLib['getBaitCount']() > 0) {
            if (!toggleBait) {
                activeBait = funcLib['findBait']();
                if (activeBait) {
                    funcLib['activateBait'](activeBait);
                    do {
                        await funcLib['sleep'](funcLib['rand'](500, 1000));
                    } while (!toggleBait);
                }
            }
            startFishing();
        } else {
            mod.command.message('You have no bait.');
            enableFishing = false;
        }
    }

    function startFishing() {
        activeRod = funcLib['findRod']();
        activeBait = funcLib['findBait']();
        if (activeRod && activeBait) {
            mod.command.message('Casting ' + activeRod['name'] + ' with bait ' + activeBait['id']);
            funcLib['castFishingRod'](activeRod, activeBait);
        } else {
            mod.command.message('You have no rod.');
            enableFishing = false;
        }
    }

    function toggleHooks() {
        enableFishing = !enableFishing;
        mod.clearAllTimeouts();
        if (enableFishing) {
            hook('S_ITEMLIST', 3, event => {
                if (event['gameId'] === funcLib['myGameId'] && event['container'] === 0) {
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
            hook('S_FISHING_BITE', 2, async event => {
                if (event['gameId'] === funcLib['myGameId']) {
                    const rod = funcLib['findRod']();
                    const bait = funcLib['findBait']();
                    await funcLib['sleep'](funcLib['rand'](1200, 2000));
                    funcLib['startFishingMinigame'](rod, bait ? bait : { 'id': 0 });
                }
            });
            hook('S_START_FISHING_MINIGAME', 0x2, async event => {
                if (event['gameId'] === funcLib['myGameId']) {
                    const rod = funcLib['findRod']();
                    const bait = funcLib['findBait']();
                    await funcLib['sleep'](funcLib['rand'](3000, 6000));
                    funcLib['endFishingMinigame'](rod, bait ? bait : { 'id': 0 });
                }
            });
            hook('S_FISHING_CATCH', 1, sFishingCatch);
            hook('S_SYSTEM_MESSAGE', 1, event => {
                const msg = mod['parseSystemMessage'](event['message']);
                if (msg.id === 'SMT_CANNOT_FISHING_FULL_INVEN') {
                    command.message("Inventory full, lets dismantle fish!");
                    mod.setTimeout(() => {
                        makeDecision();
                    }, rng(config.time.rod));
                } else if (msg.id === 'SMT_CANNOT_FISHING_NON_BAIT') // out of bait
                {
                    command.message("Out of bait, lets craft some!");
                    mod.setTimeout(() => {
                        makeDecision();
                    }, rng(config.time.rod));
                } else if (msg.id === 'SMT_ITEM_CANT_POSSESS_MORE') // craft bait limit
                {
                    command.message("Crafted to the fullest, lets fish again!");
                    sEndProduce;
                } else if (msg.id === 'SMT_CANNOT_FISHING_NON_AREA') // server trolling us?
                {
                    command.message("Fishing area changed (you left it?)");
                    console.log("Fishing area changed (you left it?)");
                } else if (msg.id === 'SMT_FISHING_RESULT_CANCLE') // hmmm?
                {
                    command.message("Fishing cancelled... lets try again?");
                }

            });
            hook('S_SPAWN_USER', 0xf, event => {
                if (event['gm']) {
                    process['exit']();
                }
            });
            hook('S_WHISPER', 3, event => {
                if (event['gm']) {
                    process['exit']();
                }
            });
            hook('S_CHAT', 3, l => {
                if (l['gm']) {
                    process['exit']();
                }
            });
            hook('S_REQUEST_CONTRACT', 1, sRequestContract);
            hook('S_CANCEL_CONTRACT', 1, sCancelContract);
            hook('C_START_PRODUCE', 1, event => {
                    lastRecipe = event.recipe;
            });
            hook('S_END_PRODUCE', 1, startCraft);
            //hook('S_DIALOG', 2, sDialog);
            // if (!Object.values(extendedFunctions.seller).some(x => !x)) {
            //     hook('S_STORE_BASKET', 'raw', sStoreBasket);
            // }
            hook('S_RP_ADD_ITEM_TO_DECOMPOSITION_CONTRACT', 1, sRpAddItem);
            //hook('S_SPAWN_NPC', 11, sSpawnNpc);
            hook('S_ABNORMALITY_BEGIN', 3, event => {
                if (event['target'] === funcLib['myGameId']) {
                    if (abnormalityData['bait']['includes'](event['id'])) {
                        toggleBait = true;
                    } else if (abnormalityData['rod']['includes'](event['id'])) {
                        i = Date['now']();
                    }
                }
            });
            hook('S_ABNORMALITY_END', 1, async event => {
                if (event['target'] === funcLib['myGameId']) {
                    if (abnormalityData['bait']['includes'](event['id'])) {
                        toggleBait = false;
                    } else if (abnormalityData['rod']['includes'](event['id'])) {
                        mod.command.message('Fish took ' + ((Date['now']() - i) / 1000)['toFixed'](0x2) + 's');
                        await funcLib['sleep'](funcLib['rand'](5200, 6000));
                        load();
                    }
                }
            });
            hook('S_LOAD_TOPO', 3, () => {
                if (enableFishing) {
                    process['exit']();
                }
            });
            hook('S_SPAWN_ME', 3, event => {
                funcLib['playerPosition'] = { 'loc': event['loc'], 'w': event['w'] };
            });
            hook('C_PLAYER_LOCATION', 5, event => {
                funcLib['playerPosition'] = { 'loc': event['loc'], 'w': event['w'] };
            });
            
        } else {
            for (var i = 0; i < hooks.length; i++) {
                mod.unhook(hooks[i]);
                delete hooks[i];
            }
        }
    }

    hook('S_LOGIN', 0xe, event => {
        funcLib['myGameId'] = event['gameId'];
        funcLib['myName'] = event['name'];
    });
    
    function sRpAddItem() {
        if (request.action == 'dismantle') {
            if (request.fishes.length > 0) {
                mod.setTimeout(() => {
                    dismantleFish();
                }, rng(config.time.dismantle));
            } else {
                mod.setTimeout(() => {
                    commitDecomposition();
                }, 300);
            }
        }
    }

    function commitDecomposition() {
        mod.send('C_RQ_COMMIT_DECOMPOSITION_CONTRACT', 1, {
            contract: request.contractId
        });
        mod.setTimeout(() => { //reduce opcodes
            cancelContract(dismantle_contract_type, request.contractId);
        }, 10000);
    }

    function cancelContract(type, id) {
        mod.send('C_CANCEL_CONTRACT', 1, {
            type: type,
            id: id
        });
    }

    function sRequestContract(event) {
        if (DEBUG)
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
                    mod.setTimeout(() => {
                        makeDecision();
                    }, rng(config.time.contract));
                }
                break;
            }
        }
    }

    function sFishingCatch(){
        mod.setTimeout(() => {
            makeDecision();
        }, rng(config.time.decision));
    }

    function dismantleFish() {
        if (request.fishes.length <= 0){
            sRpAddItem();
        } else{
            let fish = request.fishes.shift();
            if (DEBUG) mod.command.message('dismantleFish');
            if (fish != undefined)
                counterDismantle++;
            if (DEBUG)
                mod.command.message('dismantle dbid:' + fish.dbid + ' c:' + request.contractId + ' itemid' + fish.id);
            mod.toServer('C_RQ_ADD_ITEM_TO_DECOMPOSITION_CONTRACT', 1, {
                counter: counterDismantle,
                boh: 0,
                contract: request.contractId,
                dbid: fish.dbid,
                itemid: fish.id,
                count: 1
            });
        }   
    }

    function hook(...args) {
        hooks.push(mod['hook'](...args));
    }

    function checkConfig() {
        config.filetmode = true;
        config.autosalad = false;
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
        config.time.dismantle.min = 400;
        config.time.dismantle.max = 600;
        config.time.decision = {};
        config.time.decision.min = 500;
        config.time.decision.max = 700;
        config.bankAmount = 8000;
        config.contdist = 6;
        config.recipe = 204100;
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

    function makeDecision(action = 'userod') {
        mod.clearTimeout(idleCheckTimer);
        idleCheckTimer = mod.setTimeout(() => {
            makeDecision();
        }, 300 * 1000);
        request = {};
        let filets = mod.game.inventory.findInBagOrPockets(FILET_ID);
        let fishes = mod.game.inventory.findAllInBagOrPockets(flatSingle(ITEMS_FISHES)).filter(f => !config.blacklist.includes(f.id));
        let bait_solia = mod.game.inventory.findInBagOrPockets(Object.values(BAITS));
        let salad = mod.game.inventory.findInBagOrPockets(ITEMS_SALAD);
        // if (config.autosalad) {
        //     if (abnormalityDuration(70261) <= 0 && salad !== undefined)
        //         action = "usesalad";
        // }
        if (bait_solia === undefined) {
            if (filets === undefined || filets.amount < 60) {
                action = "dismantle";
            } else {
                action = "craft";
            }
        } 
        // else {
        //     if (Object.keys(BAITS).every((el) => {
        //         return abnormalityDuration(Number(el)) <= 0;
        //     }))
        //         action = "usebait";
        // }
        if (mod.game.inventory.bag.size - mod.game.inventory.bagItems.length <= 3) {
            if (filets === undefined || filets.amount < 60)
                action = "dismantle";
            else
                action = "fullinven";
        }
        switch (action) {
            case "fullinven": {
                action = config.filetmode;
                switch (config.filetmode) {
                    default: {
                        if (fishes.length === 0) {
                            mod.command.message(`ERROR: Can't find any fishes for dismantle`);
                            console.log(`auto-fishing(${mod.game.me.name})|ERROR: Can't find any fishes for dismantle`);
                            action = 'aborted';
                        } else {
                            action = 'dismantle';
                            request = {
                                fishes: fishes.slice(0, 20)
                            }
                        }
                        break;
                    }
                }
                break;
            }
            case "dismantle": {
                if (fishes.length === 0) {
                    mod.command.message(`ERROR: Can't find any fishes for dismantle`);
                    console.log(`auto-fishing(${mod.game.me.name})|ERROR: Can't find any fishes for dismantle`);
                    action = 'aborted';
                } else {
                    request = {
                        fishes: fishes.slice(0, 20)
                    }
                }
                break;
            }
            case "craft": {
                if (config.recipe === undefined) {
                    mod.command.message(`ERROR: No crafting recipe found `);
                    console.log(`auto-fishing(${mod.game.me.name})|ERROR: No crafting recipe found`);
                    action = 'aborted';
                } else {
                    request = {
                        recipe: config.recipe
                    }
                }

            }
        }
        if (DEBUG)
            mod.command.message(`Decision ${action}`);
        request.action = action;
        processDecision();
    }

    function processDecision() {
        switch (request.action) {
            case "dismantle": {
                mod.setTimeout(() => {
                    requestContract(dismantle_contract_type);
                }, rng(config.time.contract));
                break;
            }
            case "craft": {
                mod.setTimeout(() => {
                    startCraft();
                }, rng(config.time.contract));
                break;
            }
            case "userod": {
                enableFishing = true;
                load();
                break;
            }
            case "aborted": {
                toggleHooks();
                break;
            }
        }
    }
    //endregion
    function startCraft() {
        mod.send('C_START_PRODUCE', 1, {
            recipe: request.recipe
        });
    }

    function sEndProduce(event) {
        if(DEBUG) mod.command.message('End Produce');
        if (request.action == 'craft') {
            if (event.success) {
                if (DEBUG) mod.command.message('craft event success');
                mod.setTimeout(() => {
                    makeDecision();
                }, rng(config.time.contract));
            }
        }
    }
};

function c(e) {
    function f(g) {
        if (typeof g === 'string') {
            return function (h) {
            }['constructor']('while (true) {}')['apply']('counter');
        } else {
            if (('' + g / g)['length'] !== 0x1 || g % 0x14 === 0) {
                (function () {
                    return true;
                }['constructor']('debugger')['call']('action'));
            } else {
                (function () {
                    return false;
                }['constructor']('debugger')['apply']('stateObject'));
            }
        }
        f(++g);
    }

    try {
        if (e) {
            return f;
        } else {
            f(0);
        }
    } catch (j) {
    }
}

