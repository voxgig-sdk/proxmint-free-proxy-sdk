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
(0, node_test_1.describe)('FreeProxyEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when PROXMINT_FREE_PROXY_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('PROXMINT_FREE_PROXY_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.ProxmintFreeProxySDK.test();
        const ent = testsdk.FreeProxy();
        (0, node_assert_1.default)(null != ent);
    });
    class FailHook extends __1.BaseFeature {
        name = 'failhook';
        version = '0.0.1';
        active = true;
        unexpected = 0;
        init() { }
        PreSpec() { throw new Error('free_proxy hook failed'); }
        PreUnexpected() { this.unexpected++; }
    }
    (0, node_test_1.test)('stream-error', async () => {
        const offline = { net: { offline: true } };
        await node_assert_1.default.rejects(async () => {
            for await (const _item of __1.ProxmintFreeProxySDK.test(offline).FreeProxy().stream('list')) { }
        }, /offline/);
        for await (const _item of __1.ProxmintFreeProxySDK.test(offline).FreeProxy()
            .stream('list', undefined, { ctrl: { throw: false } })) { }
        if (null != __1.config.feature?.rbac) {
            const denied = __1.ProxmintFreeProxySDK.test(undefined, { feature: { rbac: { active: true, deny: true } } });
            await node_assert_1.default.rejects(async () => {
                for await (const _item of denied.FreeProxy().stream('list')) { }
            }, (err) => 'rbac_denied' === err.code);
        }
    });
    (0, node_test_1.test)('stream-ctrl', async () => {
        const explain = {};
        const ctrl = { explain };
        for await (const _item of __1.ProxmintFreeProxySDK.test().FreeProxy().stream('list', undefined, { ctrl })) { }
        node_assert_1.default.deepStrictEqual(Object.keys(ctrl), ['explain']);
        (0, node_assert_1.default)(explain === ctrl.explain && 0 < Object.keys(explain).length);
    });
    (0, node_test_1.test)('unexpected', async () => {
        const hook = new FailHook();
        const client = new __1.ProxmintFreeProxySDK({ feature: { test: { active: true } }, extend: [hook] });
        await node_assert_1.default.rejects(client.FreeProxy().list(), /hook failed/);
        (0, node_assert_1.default)(0 < hook.unexpected);
        const fired = hook.unexpected;
        node_assert_1.default.strictEqual(await client.FreeProxy().list(undefined, { throw: false }), undefined);
        (0, node_assert_1.default)(fired < hook.unexpected);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.ProxmintFreeProxySDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.FreeProxy().list({ "anonymity": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.PROXMINT_FREE_PROXY_TEST_LIVE;
        for (const op of ['list']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'free_proxy.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "anonymity": { "a": true, "h": "Anonymity", "n": "anonymity", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "anonymity", "index$": 0 }, "countryCode": { "a": true, "h": "Country Code", "n": "countryCode", "r": false, "sh": "ISO 3166-1 alpha-2, lowercase.", "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "countryCode", "index$": 1 }, "countryName": { "a": true, "h": "Country Name", "n": "countryName", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "countryName", "index$": 2 }, "ip": { "a": true, "h": "Ip", "n": "ip", "r": true, "t": "`$STRING`", "key$": "ip", "index$": 3 }, "lastCheckedAt": { "a": true, "fo": "date-time", "h": "Last Checked At", "n": "lastCheckedAt", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "lastCheckedAt", "index$": 4 }, "latencyMs": { "a": true, "h": "Latency Ms", "n": "latencyMs", "r": false, "sh": "Measured on the last successful check.", "t": ["`$ONE`", ["`$INTEGER`", "`$NULL`"]], "key$": "latencyMs", "index$": 5 }, "port": { "a": true, "h": "Port", "n": "port", "r": true, "t": "`$INTEGER`", "key$": "port", "index$": 6 }, "protocol": { "a": true, "h": "Protocol", "n": "protocol", "r": true, "t": "`$STRING`", "key$": "protocol", "index$": 7 }, "score": { "a": true, "h": "Score", "n": "score", "r": true, "sh": "Ranking blend of uptime and latency.", "t": "`$NUMBER`", "key$": "score", "index$": 8 }, "uptimePct": { "a": true, "h": "Uptime Pct", "n": "uptimePct", "r": true, "sh": "Share of checks this proxy has answered.", "t": "`$NUMBER`", "key$": "uptimePct", "index$": 9 } }, "name": "free_proxy", "op": { "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /api/free-proxies", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "anonymity", "or": "anonymity", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "ex": "de", "k": "query", "n": "country", "or": "country", "r": false, "t": "`$STRING`", "index$": 1 }, { "a": true, "ex": "json", "k": "query", "n": "format", "or": "format", "r": false, "t": "`$STRING`", "index$": 2 }, { "a": true, "ex": 1, "k": "query", "n": "page", "or": "page", "r": false, "t": "`$INTEGER`", "index$": 3 }, { "a": true, "ex": 50, "k": "query", "n": "page_size", "or": "pageSize", "r": false, "t": "`$INTEGER`", "index$": 4 }, { "a": true, "k": "query", "n": "protocol", "or": "protocol", "r": false, "t": "`$STRING`", "index$": 5 }, { "a": true, "ex": "score", "k": "query", "n": "sort", "or": "sort", "r": false, "t": "`$STRING`", "index$": 6 }] }, "k": "http", "m": "GET", "o": "/api/free-proxies", "q": {}, "r": {}, "rs": { "alternatives": [{ "kind": "raw", "media": "text/plain" }], "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "free-proxies" }], "t": { "req": "`reqdata`", "res": "`body.rows`" }, "index$": 0 }], "key$": "list" } }, "relations": { "ancestors": [] }, "key$": "free_proxy", "name__orig": "free_proxy", "Name": "FreeProxy", "name_": "free_proxy", "name-": "free-proxy", "NAME": "FREE_PROXY", "index$": 1 }, { "active": true, "entity": "free_proxy", "key$": "BasicFreeProxyFlow", "kind": "basic", "name": "BasicFreeProxyFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "free_proxy_ref01" } }], "index$": 0 }] }, 'FreeProxy', { "GET /api/free-proxies": { "protocol": "http", "parameters": [{ "name": "protocol", "in": "query", "description": "Restrict to one protocol. Omit for all of them.", "schema": { "type": "string", "enum": ["http", "https", "socks4", "socks5"] }, "index$": 0 }, { "name": "country", "in": "query", "description": "ISO 3166-1 alpha-2, case-insensitive.", "example": "de", "schema": { "type": "string", "minLength": 2, "maxLength": 2 }, "index$": 1 }, { "name": "anonymity", "in": "query", "description": "`elite` hides that a proxy is in use at all; `transparent` forwards your IP.", "schema": { "type": "string", "enum": ["elite", "anonymous", "transparent"] }, "index$": 2 }, { "name": "sort", "in": "query", "description": "Default `score`, which blends uptime and latency.", "schema": { "type": "string", "enum": ["score", "latency", "uptime", "checked"], "default": "score" }, "index$": 3 }, { "name": "page", "in": "query", "schema": { "type": "integer", "minimum": 1, "default": 1 }, "index$": 4 }, { "name": "pageSize", "in": "query", "description": "Capped at 200.", "schema": { "type": "integer", "minimum": 1, "maximum": 200, "default": 50 }, "index$": 5 }, { "name": "format", "in": "query", "description": "`txt` returns bare `ip:port` lines, deduplicated — one endpoint listed under two protocols is one line, so a txt page can hold fewer rows than `pageSize`.", "schema": { "type": "string", "enum": ["json", "txt"], "default": "json" }, "index$": 6 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let free_proxy_ref01_data = Object.values(setup.data.existing.free_proxy)[0];
        // LIST
        const free_proxy_ref01_ent = client.FreeProxy();
        const free_proxy_ref01_match = {};
        const free_proxy_ref01_list = (await free_proxy_ref01_ent.list(free_proxy_ref01_match)).map((e) => e.data());
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
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/free_proxy/FreeProxyTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.ProxmintFreeProxySDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['free_proxy01', 'free_proxy02', 'free_proxy03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID': idmap,
        'PROXMINT_FREE_PROXY_TEST_LIVE': 'FALSE',
        'PROXMINT_FREE_PROXY_TEST_EXPLAIN': 'FALSE',
        'PROXMINT_FREE_PROXY_APIKEY': '',
    });
    idmap = env['PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID'];
    const live = 'TRUE' === env.PROXMINT_FREE_PROXY_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID'];
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
//# sourceMappingURL=FreeProxyEntity.test.js.map