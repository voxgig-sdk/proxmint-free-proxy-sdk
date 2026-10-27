import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "account",
    "accessor": "Account",
    "op": "list",
    "method": "GET",
    "path": "/api/v1/account",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "balance": {
        "cents": 1,
        "usd": "12.50"
      },
      "products": [
        {
          "id": "x",
          "product": "datacenter",
          "name": "Residential",
          "status": "active",
          "billing": "pack",
          "bandwidth": {
            "limitBytes": 1,
            "usedBytes": 1,
            "remainingBytes": 1,
            "syncedAt": "2026-01-01T00:00:00Z"
          },
          "proxy": {
            "host": "gw.proxmint.com",
            "httpPort": 823,
            "socks5Port": 824,
            "username": "x",
            "password": "x"
          }
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "free_proxy",
    "accessor": "FreeProxy",
    "op": "list",
    "method": "GET",
    "path": "/api/free-proxies",
    "args": [],
    "select": {
      "anonymity": "v1",
      "country": "de",
      "format": "json",
      "page": 1,
      "page_size": 50,
      "protocol": "v1",
      "sort": "score"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/plain"
    ],
    "query": [
      "protocol",
      "country",
      "anonymity",
      "sort",
      "page",
      "pageSize",
      "format"
    ],
    "queryArgs": [
      {
        "name": "anonymity",
        "wire": "anonymity"
      },
      {
        "name": "country",
        "wire": "country"
      },
      {
        "name": "format",
        "wire": "format"
      },
      {
        "name": "page",
        "wire": "page"
      },
      {
        "name": "page_size",
        "wire": "pageSize"
      },
      {
        "name": "protocol",
        "wire": "protocol"
      },
      {
        "name": "sort",
        "wire": "sort"
      }
    ],
    "auth": [],
    "status": 200,
    "sample": {
      "rows": [
        {
          "ip": "x",
          "port": 1,
          "protocol": "http",
          "countryCode": "x",
          "countryName": "x",
          "anonymity": "elite",
          "latencyMs": 1,
          "uptimePct": 1,
          "score": 1,
          "lastCheckedAt": "2026-01-01T00:00:00Z"
        }
      ],
      "total": 1,
      "page": 1,
      "pageSize": 1
    },
    "idField": "id"
  },
  {
    "entity": "geo_ip",
    "accessor": "GeoIp",
    "op": "load",
    "method": "GET",
    "path": "/api/geoip",
    "args": [],
    "select": {
      "ip": "8.8.8.8"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "ip"
    ],
    "queryArgs": [
      {
        "name": "ip",
        "wire": "ip"
      }
    ],
    "auth": [],
    "status": 200,
    "sample": {
      "ip": "x",
      "countryCode": "x",
      "countryName": "x",
      "city": "x",
      "region": "x",
      "lat": 1,
      "lon": 1,
      "tz": "x",
      "accuracyRadiusKm": 1,
      "asn": 1,
      "asnOrg": "x"
    },
    "idField": "id"
  },
  {
    "entity": "usage",
    "accessor": "Usage",
    "op": "list",
    "method": "GET",
    "path": "/api/v1/usage",
    "args": [],
    "select": {
      "day": 30
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "days"
    ],
    "queryArgs": [
      {
        "name": "day",
        "wire": "days"
      }
    ],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "days": 1,
      "usage": [
        {
          "productId": "x",
          "product": "datacenter",
          "day": "2026-09-29",
          "bytes": 1,
          "requests": 1
        }
      ]
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
