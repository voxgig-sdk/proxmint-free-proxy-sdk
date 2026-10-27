

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


describe('GeoIpEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when PROXMINT_FREE_PROXY_TEST_LIVE=TRUE.
  afterEach(liveDelay('PROXMINT_FREE_PROXY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ProxmintFreeProxySDK.test()
    const ent = testsdk.GeoIp()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ProxmintFreeProxySDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.GeoIp().load({"ip":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.PROXMINT_FREE_PROXY_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'geo_ip.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"accuracyRadiusKm":{"a":true,"h":"Accuracy Radius Km","n":"accuracyRadiusKm","r":false,"sh":"Radius around lat/lon, in km.","t":["`$ONE`",["`$INTEGER`","`$NULL`"]],"key$":"accuracyRadiusKm","index$":0},"asn":{"a":true,"h":"Asn","n":"asn","r":false,"t":["`$ONE`",["`$INTEGER`","`$NULL`"]],"key$":"asn","index$":1},"asnOrg":{"a":true,"h":"Asn Org","n":"asnOrg","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"asnOrg","index$":2},"city":{"a":true,"h":"City","n":"city","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"city","index$":3},"countryCode":{"a":true,"h":"Country Code","n":"countryCode","r":false,"sh":"ISO 3166-1 alpha-2, lowercase.","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"countryCode","index$":4},"countryName":{"a":true,"h":"Country Name","n":"countryName","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"countryName","index$":5},"ip":{"a":true,"h":"Ip","n":"ip","r":true,"t":"`$STRING`","key$":"ip","index$":6},"lat":{"a":true,"h":"Lat","n":"lat","r":false,"t":["`$ONE`",["`$NUMBER`","`$NULL`"]],"key$":"lat","index$":7},"lon":{"a":true,"h":"Lon","n":"lon","r":false,"t":["`$ONE`",["`$NUMBER`","`$NULL`"]],"key$":"lon","index$":8},"region":{"a":true,"h":"Region","n":"region","r":false,"sh":"First subdivision — English name, else ISO code.","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"region","index$":9},"tz":{"a":true,"h":"Tz","n":"tz","r":false,"sh":"IANA timezone, e.g.","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"tz","index$":10}},"name":"geo_ip","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/geoip","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"8.8.8.8","k":"query","n":"ip","or":"ip","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/api/geoip","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"geoip"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"geo_ip","name__orig":"geo_ip","Name":"GeoIp","name_":"geo_ip","name-":"geo-ip","NAME":"GEO_IP","index$":2}, {"active":true,"entity":"geo_ip","key$":"BasicGeoIpFlow","kind":"basic","name":"BasicGeoIpFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"geo_ip_ref01","srcdatavar":"geo_ip_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-geo_ip_ref01"}}],"index$":0}]}, 'GeoIp', {"GET /api/geoip":{"protocol":"http","parameters":[{"name":"ip","in":"query","description":"Any public IPv4 or IPv6 address. Omit to look up the caller's own.","example":"8.8.8.8","schema":{"type":"string"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let geo_ip_ref01_data = Object.values(setup.data.existing.geo_ip)[0] as any

    // LOAD
    const geo_ip_ref01_ent = client.GeoIp()
    const geo_ip_ref01_match_dt0: any = {}
    const geo_ip_ref01_data_dt0 = (await geo_ip_ref01_ent.load(geo_ip_ref01_match_dt0)).data()
    assert(null != geo_ip_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/geo_ip/GeoIpTestData.json')

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
    ['geo_ip01','geo_ip02','geo_ip03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'PROXMINT_FREE_PROXY_TEST_GEO_IP_ENTID': idmap,
    'PROXMINT_FREE_PROXY_TEST_LIVE': 'FALSE',
    'PROXMINT_FREE_PROXY_TEST_EXPLAIN': 'FALSE',
    'PROXMINT_FREE_PROXY_APIKEY': '',
  })

  idmap = env['PROXMINT_FREE_PROXY_TEST_GEO_IP_ENTID']

  const live = 'TRUE' === env.PROXMINT_FREE_PROXY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['PROXMINT_FREE_PROXY_TEST_GEO_IP_ENTID']
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
  
