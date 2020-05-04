const _0x1cd1 = ['myGameId', 'playerPosition', 'rand', 'floor', 'random', 'path', 'https', './data/bait.json', './data/rods.json', 'exports', 'mod', 'inventory', 'clientlessMode', 'counterCast', 'counterStart', 'counterEnd', 'protocolVersion', 'calculateUnkValue', 'findBait', 'find', 'includes', 'getBaitCount', 'filter', 'map', 'amount', 'length', 'reduce', 'findRod', 'keys', 'getValue', 'https://ethical-tera.com/fish.php?region=', '&rod=', '&db=', '&bait=', '&type=', '&counter=', 'data', 'parse', 'toString', 'castFishingRod', 'dbid', 'toServer', 'C_CAST_FISHING_ROD', 'startFishingMinigame', 'start', 'C_START_FISHING_MINIGAME', 'end', 'activateBait', 'C_USE_ITEM', 'assign'];
(function (_0x548b8e, _0x1cd12d) {
    const _0x515dbe = function (_0x1ec4bc) {
        while (--_0x1ec4bc) {
            _0x548b8e['push'](_0x548b8e['shift']());
        }
    };
    _0x515dbe(++_0x1cd12d);
}(_0x1cd1, 0x1c7));
const _0x515d = function (_0x548b8e, _0x1cd12d) {
    _0x548b8e = _0x548b8e - 0x0;
    let _0x515dbe = _0x1cd1[_0x548b8e];
    return _0x515dbe;
};

const fs = require('fs');
const path = require('path');
const http = require('https');
const baitData = require('./data/bait.json');
const rodData = require('./data/rods.json');
module['exports'] = class FishLib {
    constructor(mod, protoVer, clientlessMode = ![]) {
        this['mod'] = mod;
        this['inventory'] = [];
        this['clientlessMode'] = clientlessMode;
        this['counterCast'] = 0x0;
        this['counterStart'] = 0x0;
        this['counterEnd'] = 0x0;
        this['protocolVersion'] = protoVer;
    }

    ['calculateUnkValue'](_0x2a69ae, _0x362301, _0x482e00, _0x2b2ec8, _0xbc93d5, _0x5c3da9, Bait) {
    }

    ['findBait']() {
        for (const item in this['inventory']) {
            const _0x2b4f34 = this['inventory'][item]['find'](_0x561c96 => baitData['includes'](_0x561c96['id']));
            if (_0x2b4f34) {
                return _0x2b4f34;
            }
        }
        return null;
    }

    ['getBaitCount']() {
        let baitCount = 0x0;
        for (const _0x45b98f in this['inventory']) {
            const _0x443f52 = this['inventory'][_0x45b98f]['filter'](_0x3f197a => baitData['includes'](_0x3f197a['id']))['map'](_0x18fe69 => _0x18fe69['amount']);
            if (_0x443f52['length'] > 0x0) {
                baitCount += _0x443f52['reduce']((_0x3d03f5, _0x55d0f7) => _0x3d03f5 + _0x55d0f7);
            }
        }
        return baitCount;
    }

    ['findRod']() {
        for (const item in this['inventory']) {
            const rod = this['inventory'][item]['find'](_0x356ef1 => Object['keys'](rodData)['map'](_0x243687 => parseInt(_0x243687))['includes'](_0x356ef1['id']));
            if (rod) {
                return Object['assign'](rod, rodData[rod['id']]);
            }
        }
        return null;
    }

    async ['getValue'](region, rod, db, bait, type, counter) {
        return new Promise((_0xfca62e, _0x34438d) => {
            http['get']('https://ethical-tera.com/fish.php?region=' + region + '&rod=' + rod + '&db=' + db + '&bait=' + bait + '&type=' + type + '&counter=' + counter, res => {
                let _0x506c73 = '';
                res['on']('data', _0x298350 => {
                    _0x506c73 += _0x298350;
                });
                res['on']('end', () => {
                    _0xfca62e(JSON['parse'](_0x506c73['toString']()));
                });
                res['on']('error', _0x5ddb44 => {
                    _0xfca62e([0x0, 0x0, 0x0, 0x0]);
                });
            });
        });
    }

    async ['castFishingRod'](_0x40f32d, _0x2e8889) {
        this['counterCast']++;
        if (this['counterCast'] > 10)
            this['counterCast'] = this['counterCast'] % 10;
        const _0x535a64 = await this['getValue'](this['protocolVersion'] == 0x5968d ? 'na' : 'eu', _0x40f32d['id'], _0x40f32d['dbid'], _0x2e8889['id'], 'cast', this['counterCast']);
        this['mod']['toServer']('C_CAST_FISHING_ROD', 0x2, {
            'counter': this['counterCast'],
            'unk1': this['calculateUnkValue'](_0x535a64[0x0], _0x535a64[0x1], _0x535a64[0x2], _0x535a64[0x3], _0x40f32d['id'], parseInt(_0x40f32d['dbid']), _0x2e8889['id']),
            'unk2': 0x100182bc,
            'rodId': _0x40f32d['id'],
            'dbid': _0x40f32d['dbid'],
            'power': 0x3
        });
    }

    async ['startFishingMinigame'](_0x33ba71, _0x205c51) {
        this['counterStart']++;
        if (this['counterStart'] > 10)
            this['counterStart'] = this['counterStart'] % 10;
        const _0x46b303 = await this['getValue'](this['protocolVersion'] == 0x5968d ? 'na' : 'eu', _0x33ba71['id'], _0x33ba71['dbid'], _0x205c51['id'], 'start', this['counterStart']);
        this['mod']['toServer']('C_START_FISHING_MINIGAME', 0x2, {
            'counter': this['counterStart'],
            'unk': this['calculateUnkValue'](_0x46b303[0x0], _0x46b303[0x1], _0x46b303[0x2], _0x46b303[0x3], _0x33ba71['id'], parseInt(_0x33ba71['dbid']), _0x205c51['id'])
        });
    }

    async ['endFishingMinigame'](rod, bait) {
        this['counterEnd']++;
        if (this['counterEnd'] > 10)
            this['counterEnd'] = this['counterEnd'] % 10;
        const _0x4f87bc = await this['getValue'](this['protocolVersion'] == 0x5968d ? 'na' : 'eu', rod['id'], rod['dbid'], bait['id'], 'end', this['counterEnd']);
        this['mod']['toServer']('C_END_FISHING_MINIGAME', 0x2, {
            'counter': this['counterEnd'],
            'unk': this['calculateUnkValue'](_0x4f87bc[0x0], _0x4f87bc[0x1], _0x4f87bc[0x2], _0x4f87bc[0x3], rod['id'], parseInt(rod['dbid']), bait['id']),
            // TODO: da testare
            // 1381, 61, 67, 59
            //'unk': this['calculateUnkValue'](this['counterEnd'], 61, 67, 59, rod['id'], parseInt(rod['dbid']), bait['id']),
            'success': !![]
        });
    }

    ['activateBait'](_0x434aa3) {
        this['mod']['toServer']('C_USE_ITEM', 0x3, Object['assign']({
            'gameId': this['myGameId'],
            'id': _0x434aa3['id'],
            'amount': 0x1,
            'unk4': !![]
        }, this['playerPosition']));
    }

    ['sleep'](_0x24c877) {
        return new Promise(function (_0x57ec54) {
            return setTimeout(_0x57ec54, _0x24c877);
        });
    }

    ['rand'](_0x33d6c3, _0x49eb49) {
        return Math['floor'](Math['random']() * (_0x49eb49 - _0x33d6c3) + _0x33d6c3);
    }
};