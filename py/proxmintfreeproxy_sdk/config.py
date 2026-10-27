# ProxmintFreeProxy SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "ProxmintFreeProxy",
            "slug": "proxmint-free-proxy",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "now": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://proxmint.com",
            "auth": {
                "prefix": "Bearer",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "account": {},
                "free_proxy": {},
                "geo_ip": {},
                "usage": {},
            },
        },
        "entity": {
      "account": {
        "fields": [
          {
            "name": "bandwidth",
            "title": "Bandwidth",
            "type": "`$OBJECT`",
            "req": True,
          },
          {
            "name": "billing",
            "title": "Billing",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "req": True,
            "short": "Stable product id; matches `productId` in usage rows.",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "product",
            "title": "Product",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "proxy",
            "title": "Proxy",
            "type": "`$OBJECT`",
            "req": True,
            "short": "Everything a client needs to connect.",
          },
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
            "req": True,
            "short": "`expired` means the bandwidth is used up — packs never expire by date.",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "account",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/api/v1/account",
                "segments": [
                  {
                    "lit": "api",
                  },
                  {
                    "lit": "v1",
                  },
                  {
                    "lit": "account",
                  },
                ],
                "parts": [
                  "api",
                  "v1",
                  "account",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.products`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "free_proxy": {
        "fields": [
          {
            "name": "anonymity",
            "title": "Anonymity",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "countryCode",
            "title": "Country Code",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "short": "ISO 3166-1 alpha-2, lowercase.",
          },
          {
            "name": "countryName",
            "title": "Country Name",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "ip",
            "title": "Ip",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "lastCheckedAt",
            "title": "Last Checked At",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "format": "date-time",
          },
          {
            "name": "latencyMs",
            "title": "Latency Ms",
            "type": [
              "`$ONE`",
              [
                "`$INTEGER`",
                "`$NULL`",
              ],
            ],
            "short": "Measured on the last successful check.",
          },
          {
            "name": "port",
            "title": "Port",
            "type": "`$INTEGER`",
            "req": True,
          },
          {
            "name": "protocol",
            "title": "Protocol",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "score",
            "title": "Score",
            "type": "`$NUMBER`",
            "req": True,
            "short": "Ranking blend of uptime and latency.",
          },
          {
            "name": "uptimePct",
            "title": "Uptime Pct",
            "type": "`$NUMBER`",
            "req": True,
            "short": "Share of checks this proxy has answered.",
          },
        ],
        "name": "free_proxy",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/api/free-proxies",
                "segments": [
                  {
                    "lit": "api",
                  },
                  {
                    "lit": "free-proxies",
                  },
                ],
                "parts": [
                  "api",
                  "free-proxies",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.rows`",
                },
                "args": {
                  "query": [
                    {
                      "name": "anonymity",
                      "orig": "anonymity",
                      "type": "`$STRING`",
                      "kind": "query",
                      "field": True,
                    },
                    {
                      "name": "country",
                      "orig": "country",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "de",
                    },
                    {
                      "name": "format",
                      "orig": "format",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "json",
                    },
                    {
                      "name": "page",
                      "orig": "page",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 1,
                    },
                    {
                      "name": "page_size",
                      "orig": "pageSize",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 50,
                    },
                    {
                      "name": "protocol",
                      "orig": "protocol",
                      "type": "`$STRING`",
                      "kind": "query",
                      "field": True,
                    },
                    {
                      "name": "sort",
                      "orig": "sort",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "score",
                    },
                  ],
                },
                "select": {},
                "response": {
                  "alternatives": [
                    {
                      "kind": "raw",
                      "media": "text/plain",
                    },
                  ],
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "geo_ip": {
        "fields": [
          {
            "name": "accuracyRadiusKm",
            "title": "Accuracy Radius Km",
            "type": [
              "`$ONE`",
              [
                "`$INTEGER`",
                "`$NULL`",
              ],
            ],
            "short": "Radius around lat/lon, in km.",
          },
          {
            "name": "asn",
            "title": "Asn",
            "type": [
              "`$ONE`",
              [
                "`$INTEGER`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "asnOrg",
            "title": "Asn Org",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "city",
            "title": "City",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "countryCode",
            "title": "Country Code",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "short": "ISO 3166-1 alpha-2, lowercase.",
          },
          {
            "name": "countryName",
            "title": "Country Name",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "ip",
            "title": "Ip",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "lat",
            "title": "Lat",
            "type": [
              "`$ONE`",
              [
                "`$NUMBER`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "lon",
            "title": "Lon",
            "type": [
              "`$ONE`",
              [
                "`$NUMBER`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "region",
            "title": "Region",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "short": "First subdivision — English name, else ISO code.",
          },
          {
            "name": "tz",
            "title": "Tz",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "short": "IANA timezone, e.g.",
          },
        ],
        "name": "geo_ip",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/api/geoip",
                "segments": [
                  {
                    "lit": "api",
                  },
                  {
                    "lit": "geoip",
                  },
                ],
                "parts": [
                  "api",
                  "geoip",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "ip",
                      "orig": "ip",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "8.8.8.8",
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "usage": {
        "fields": [
          {
            "name": "bytes",
            "title": "Bytes",
            "type": "`$INTEGER`",
            "req": True,
          },
          {
            "name": "day",
            "title": "Day",
            "type": "`$STRING`",
            "req": True,
            "format": "date",
          },
          {
            "name": "product",
            "title": "Product",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "productId",
            "title": "Product Id",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "requests",
            "title": "Requests",
            "type": "`$INTEGER`",
            "req": True,
          },
        ],
        "name": "usage",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/api/v1/usage",
                "segments": [
                  {
                    "lit": "api",
                  },
                  {
                    "lit": "v1",
                  },
                  {
                    "lit": "usage",
                  },
                ],
                "parts": [
                  "api",
                  "v1",
                  "usage",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.usage`",
                },
                "args": {
                  "query": [
                    {
                      "name": "day",
                      "orig": "days",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 30,
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
