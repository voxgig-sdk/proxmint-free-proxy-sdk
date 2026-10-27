

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { ProxmintFreeProxySDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('FreeProxyEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when PROXMINT_FREE_PROXY_TEST_LIVE=TRUE.
  afterEach(liveDelay('PROXMINT_FREE_PROXY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ProxmintFreeProxySDK.test()
    const ent = testsdk.FreeProxy()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('free_proxy hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of ProxmintFreeProxySDK.test(offline).FreeProxy().stream('list')) { }
    }, /offline/)

    for await (const _item of ProxmintFreeProxySDK.test(offline).FreeProxy()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = ProxmintFreeProxySDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.FreeProxy().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of ProxmintFreeProxySDK.test().FreeProxy().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new ProxmintFreeProxySDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.FreeProxy().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.FreeProxy().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ProxmintFreeProxySDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.FreeProxy().list({"anonymity":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.PROXMINT_FREE_PROXY_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'free_proxy.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"anonymity":{"a":true,"h":"Anonymity","n":"anonymity","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"anonymity","index$":0},"countryCode":{"a":true,"h":"Country Code","n":"countryCode","r":false,"sh":"ISO 3166-1 alpha-2, lowercase.","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"countryCode","index$":1},"countryName":{"a":true,"h":"Country Name","n":"countryName","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"countryName","index$":2},"ip":{"a":true,"h":"Ip","n":"ip","r":true,"t":"`$STRING`","key$":"ip","index$":3},"lastCheckedAt":{"a":true,"fo":"date-time","h":"Last Checked At","n":"lastCheckedAt","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"lastCheckedAt","index$":4},"latencyMs":{"a":true,"h":"Latency Ms","n":"latencyMs","r":false,"sh":"Measured on the last successful check.","t":["`$ONE`",["`$INTEGER`","`$NULL`"]],"key$":"latencyMs","index$":5},"port":{"a":true,"h":"Port","n":"port","r":true,"t":"`$INTEGER`","key$":"port","index$":6},"protocol":{"a":true,"h":"Protocol","n":"protocol","r":true,"t":"`$STRING`","key$":"protocol","index$":7},"score":{"a":true,"h":"Score","n":"score","r":true,"sh":"Ranking blend of uptime and latency.","t":"`$NUMBER`","key$":"score","index$":8},"uptimePct":{"a":true,"h":"Uptime Pct","n":"uptimePct","r":true,"sh":"Share of checks this proxy has answered.","t":"`$NUMBER`","key$":"uptimePct","index$":9}},"name":"free_proxy","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /api/free-proxies","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"anonymity","or":"anonymity","r":false,"t":"`$STRING`","index$":0},{"a":true,"ex":"de","k":"query","n":"country","or":"country","r":false,"t":"`$STRING`","index$":1},{"a":true,"ex":"json","k":"query","n":"format","or":"format","r":false,"t":"`$STRING`","index$":2},{"a":true,"ex":1,"k":"query","n":"page","or":"page","r":false,"t":"`$INTEGER`","index$":3},{"a":true,"ex":50,"k":"query","n":"page_size","or":"pageSize","r":false,"t":"`$INTEGER`","index$":4},{"a":true,"k":"query","n":"protocol","or":"protocol","r":false,"t":"`$STRING`","index$":5},{"a":true,"ex":"score","k":"query","n":"sort","or":"sort","r":false,"t":"`$STRING`","index$":6}]},"k":"http","m":"GET","o":"/api/free-proxies","q":{},"r":{},"rs":{"alternatives":[{"kind":"raw","media":"text/plain"}],"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"free-proxies"}],"t":{"req":"`reqdata`","res":"`body.rows`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"free_proxy","name__orig":"free_proxy","Name":"FreeProxy","name_":"free_proxy","name-":"free-proxy","NAME":"FREE_PROXY","index$":1}, {"active":true,"entity":"free_proxy","key$":"BasicFreeProxyFlow","kind":"basic","name":"BasicFreeProxyFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"free_proxy_ref01"}}],"index$":0}]}, 'FreeProxy', {"GET /api/free-proxies":{"protocol":"http","parameters":[{"name":"protocol","in":"query","description":"Restrict to one protocol. Omit for all of them.","schema":{"type":"string","enum":["http","https","socks4","socks5"]},"index$":0},{"name":"country","in":"query","description":"ISO 3166-1 alpha-2, case-insensitive.","example":"de","schema":{"type":"string","minLength":2,"maxLength":2},"index$":1},{"name":"anonymity","in":"query","description":"`elite` hides that a proxy is in use at all; `transparent` forwards your IP.","schema":{"type":"string","enum":["elite","anonymous","transparent"]},"index$":2},{"name":"sort","in":"query","description":"Default `score`, which blends uptime and latency.","schema":{"type":"string","enum":["score","latency","uptime","checked"],"default":"score"},"index$":3},{"name":"page","in":"query","schema":{"type":"integer","minimum":1,"default":1},"index$":4},{"name":"pageSize","in":"query","description":"Capped at 200.","schema":{"type":"integer","minimum":1,"maximum":200,"default":50},"index$":5},{"name":"format","in":"query","description":"`txt` returns bare `ip:port` lines, deduplicated — one endpoint listed under two protocols is one line, so a txt page can hold fewer rows than `pageSize`.","schema":{"type":"string","enum":["json","txt"],"default":"json"},"index$":6}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let free_proxy_ref01_data = Object.values(setup.data.existing.free_proxy)[0] as any

    // LIST
    const free_proxy_ref01_ent = client.FreeProxy()
    const free_proxy_ref01_match: any = {}

    const free_proxy_ref01_list = (await free_proxy_ref01_ent.list(free_proxy_ref01_match)).map((e: any) => e.data())


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/free_proxy/FreeProxyTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = ProxmintFreeProxySDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['free_proxy01','free_proxy02','free_proxy03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID': idmap,
    'PROXMINT_FREE_PROXY_TEST_LIVE': 'FALSE',
    'PROXMINT_FREE_PROXY_TEST_EXPLAIN': 'FALSE',
    'PROXMINT_FREE_PROXY_APIKEY': '',
  })

  idmap = env['PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID']

  const live = 'TRUE' === env.PROXMINT_FREE_PROXY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new ProxmintFreeProxySDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
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
    ]))
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
  }

  return setup
}
  
