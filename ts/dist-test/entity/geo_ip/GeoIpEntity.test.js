"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('GeoIpEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when PROXMINT_FREE_PROXY_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('PROXMINT_FREE_PROXY_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.ProxmintFreeProxySDK.test();
        const ent = testsdk.GeoIp();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.ProxmintFreeProxySDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.GeoIp().load({ "ip": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.PROXMINT_FREE_PROXY_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'geo_ip.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "accuracyRadiusKm": { "a": true, "h": "Accuracy Radius Km", "n": "accuracyRadiusKm", "r": false, "sh": "Radius around lat/lon, in km.", "t": ["`$ONE`", ["`$INTEGER`", "`$NULL`"]], "key$": "accuracyRadiusKm", "index$": 0 }, "asn": { "a": true, "h": "Asn", "n": "asn", "r": false, "t": ["`$ONE`", ["`$INTEGER`", "`$NULL`"]], "key$": "asn", "index$": 1 }, "asnOrg": { "a": true, "h": "Asn Org", "n": "asnOrg", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "asnOrg", "index$": 2 }, "city": { "a": true, "h": "City", "n": "city", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "city", "index$": 3 }, "countryCode": { "a": true, "h": "Country Code", "n": "countryCode", "r": false, "sh": "ISO 3166-1 alpha-2, lowercase.", "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "countryCode", "index$": 4 }, "countryName": { "a": true, "h": "Country Name", "n": "countryName", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "countryName", "index$": 5 }, "ip": { "a": true, "h": "Ip", "n": "ip", "r": true, "t": "`$STRING`", "key$": "ip", "index$": 6 }, "lat": { "a": true, "h": "Lat", "n": "lat", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "lat", "index$": 7 }, "lon": { "a": true, "h": "Lon", "n": "lon", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "lon", "index$": 8 }, "region": { "a": true, "h": "Region", "n": "region", "r": false, "sh": "First subdivision — English name, else ISO code.", "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "region", "index$": 9 }, "tz": { "a": true, "h": "Tz", "n": "tz", "r": false, "sh": "IANA timezone, e.g.", "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "tz", "index$": 10 } }, "name": "geo_ip", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /api/geoip", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "8.8.8.8", "k": "query", "n": "ip", "or": "ip", "r": false, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/api/geoip", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "geoip" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "geo_ip", "name__orig": "geo_ip", "Name": "GeoIp", "name_": "geo_ip", "name-": "geo-ip", "NAME": "GEO_IP", "index$": 2 }, { "active": true, "entity": "geo_ip", "key$": "BasicGeoIpFlow", "kind": "basic", "name": "BasicGeoIpFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "geo_ip_ref01", "srcdatavar": "geo_ip_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-geo_ip_ref01" } }], "index$": 0 }] }, 'GeoIp', { "GET /api/geoip": { "protocol": "http", "parameters": [{ "name": "ip", "in": "query", "description": "Any public IPv4 or IPv6 address. Omit to look up the caller's own.", "example": "8.8.8.8", "schema": { "type": "string" }, "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let geo_ip_ref01_data = Object.values(setup.data.existing.geo_ip)[0];
        // LOAD
        const geo_ip_ref01_ent = client.GeoIp();
        const geo_ip_ref01_match_dt0 = {};
        const geo_ip_ref01_data_dt0 = (await geo_ip_ref01_ent.load(geo_ip_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != geo_ip_ref01_data_dt0);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/geo_ip/GeoIpTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.ProxmintFreeProxySDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['geo_ip01', 'geo_ip02', 'geo_ip03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'PROXMINT_FREE_PROXY_TEST_GEO_IP_ENTID': idmap,
        'PROXMINT_FREE_PROXY_TEST_LIVE': 'FALSE',
        'PROXMINT_FREE_PROXY_TEST_EXPLAIN': 'FALSE',
        'PROXMINT_FREE_PROXY_APIKEY': '',
    });
    idmap = env['PROXMINT_FREE_PROXY_TEST_GEO_IP_ENTID'];
    const live = 'TRUE' === env.PROXMINT_FREE_PROXY_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['PROXMINT_FREE_PROXY_TEST_GEO_IP_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.ProxmintFreeProxySDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.PROXMINT_FREE_PROXY_APIKEY,
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.PROXMINT_FREE_PROXY_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=GeoIpEntity.test.js.map