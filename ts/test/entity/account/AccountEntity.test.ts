

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


describe('AccountEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when PROXMINT_FREE_PROXY_TEST_LIVE=TRUE.
  afterEach(liveDelay('PROXMINT_FREE_PROXY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ProxmintFreeProxySDK.test()
    const ent = testsdk.Account()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('account hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of ProxmintFreeProxySDK.test(offline).Account().stream('list')) { }
    }, /offline/)

    for await (const _item of ProxmintFreeProxySDK.test(offline).Account()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = ProxmintFreeProxySDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Account().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of ProxmintFreeProxySDK.test().Account().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new ProxmintFreeProxySDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Account().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Account().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ProxmintFreeProxySDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Account().list({"billing":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.PROXMINT_FREE_PROXY_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'account.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"bandwidth":{"a":true,"h":"Bandwidth","n":"bandwidth","r":true,"t":"`$OBJECT`","key$":"bandwidth","index$":0},"billing":{"a":true,"h":"Billing","n":"billing","r":true,"t":"`$STRING`","key$":"billing","index$":1},"id":{"a":true,"h":"Id","n":"id","r":true,"sh":"Stable product id; matches `productId` in usage rows.","t":"`$STRING`","key$":"id","index$":2},"name":{"a":true,"h":"Name","n":"name","r":true,"t":"`$STRING`","key$":"name","index$":3},"product":{"a":true,"h":"Product","n":"product","r":true,"t":"`$STRING`","key$":"product","index$":4},"proxy":{"a":true,"h":"Proxy","n":"proxy","r":true,"sh":"Everything a client needs to connect.","t":"`$OBJECT`","key$":"proxy","index$":5},"status":{"a":true,"h":"Status","n":"status","r":true,"sh":"`expired` means the bandwidth is used up — packs never expire by date.","t":"`$STRING`","key$":"status","index$":6}},"id":{"field":"id","name":"id"},"name":"account","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /api/v1/account","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/api/v1/account","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"account"}],"t":{"req":"`reqdata`","res":"`body.products`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"account","name__orig":"account","Name":"Account","name_":"account","name-":"account","NAME":"ACCOUNT","index$":0}, {"active":true,"entity":"account","key$":"BasicAccountFlow","kind":"basic","name":"BasicAccountFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"account_ref01"}}],"index$":0}]}, 'Account', {"GET /api/v1/account":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let account_ref01_data = Object.values(setup.data.existing.account)[0] as any

    // LIST
    const account_ref01_ent = client.Account()
    const account_ref01_match: any = {}

    const account_ref01_list = (await account_ref01_ent.list(account_ref01_match)).map((e: any) => e.data())


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
      '../../../../.sdk/test/entity/account/AccountTestData.json')

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
    ['account01','account02','account03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'PROXMINT_FREE_PROXY_TEST_ACCOUNT_ENTID': idmap,
    'PROXMINT_FREE_PROXY_TEST_LIVE': 'FALSE',
    'PROXMINT_FREE_PROXY_TEST_EXPLAIN': 'FALSE',
    'PROXMINT_FREE_PROXY_APIKEY': '',
  })

  idmap = env['PROXMINT_FREE_PROXY_TEST_ACCOUNT_ENTID']

  const live = 'TRUE' === env.PROXMINT_FREE_PROXY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['PROXMINT_FREE_PROXY_TEST_ACCOUNT_ENTID']
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
  
