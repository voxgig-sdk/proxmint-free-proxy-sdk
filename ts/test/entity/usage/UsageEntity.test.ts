

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


describe('UsageEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when PROXMINT_FREE_PROXY_TEST_LIVE=TRUE.
  afterEach(liveDelay('PROXMINT_FREE_PROXY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ProxmintFreeProxySDK.test()
    const ent = testsdk.Usage()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('usage hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of ProxmintFreeProxySDK.test(offline).Usage().stream('list')) { }
    }, /offline/)

    for await (const _item of ProxmintFreeProxySDK.test(offline).Usage()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = ProxmintFreeProxySDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Usage().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of ProxmintFreeProxySDK.test().Usage().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new ProxmintFreeProxySDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Usage().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Usage().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ProxmintFreeProxySDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Usage().list({"day":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.PROXMINT_FREE_PROXY_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'usage.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"bytes":{"a":true,"h":"Bytes","n":"bytes","r":true,"t":"`$INTEGER`","key$":"bytes","index$":0},"day":{"a":true,"fo":"date","h":"Day","n":"day","r":true,"t":"`$STRING`","key$":"day","index$":1},"product":{"a":true,"h":"Product","n":"product","r":true,"t":"`$STRING`","key$":"product","index$":2},"productId":{"a":true,"h":"Product Id","n":"productId","r":true,"t":"`$STRING`","key$":"productId","index$":3},"requests":{"a":true,"h":"Requests","n":"requests","r":true,"t":"`$INTEGER`","key$":"requests","index$":4}},"name":"usage","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /api/v1/usage","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":30,"k":"query","n":"day","or":"days","r":false,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"GET","o":"/api/v1/usage","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"usage"}],"t":{"req":"`reqdata`","res":"`body.usage`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"usage","name__orig":"usage","Name":"Usage","name_":"usage","name-":"usage","NAME":"USAGE","index$":3}, {"active":true,"entity":"usage","key$":"BasicUsageFlow","kind":"basic","name":"BasicUsageFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"usage_ref01"}}],"index$":0}]}, 'Usage', {"GET /api/v1/usage":{"protocol":"http","parameters":[{"name":"days","in":"query","description":"How many days back from today, inclusive.","schema":{"type":"integer","minimum":1,"maximum":90,"default":30},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let usage_ref01_data = Object.values(setup.data.existing.usage)[0] as any

    // LIST
    const usage_ref01_ent = client.Usage()
    const usage_ref01_match: any = {}

    const usage_ref01_list = (await usage_ref01_ent.list(usage_ref01_match)).map((e: any) => e.data())


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
      '../../../../.sdk/test/entity/usage/UsageTestData.json')

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
    ['usage01','usage02','usage03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'PROXMINT_FREE_PROXY_TEST_USAGE_ENTID': idmap,
    'PROXMINT_FREE_PROXY_TEST_LIVE': 'FALSE',
    'PROXMINT_FREE_PROXY_TEST_EXPLAIN': 'FALSE',
    'PROXMINT_FREE_PROXY_APIKEY': '',
  })

  idmap = env['PROXMINT_FREE_PROXY_TEST_USAGE_ENTID']

  const live = 'TRUE' === env.PROXMINT_FREE_PROXY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['PROXMINT_FREE_PROXY_TEST_USAGE_ENTID']
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
  
