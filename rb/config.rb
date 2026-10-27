# ProxmintFreeProxy SDK configuration

module ProxmintFreeProxyConfig
  # Return the process-wide config, built once on first use. The SDK reads
  # the config on every request and never writes to it, so one instance is
  # shared by every client rather than rebuilt per client.
  #
  # The returned hash is shared: treat it as read-only. Callers that need to
  # mutate should use make_config, which always returns a fresh copy.
  def self.shared_config
    @shared_config ||= make_config
  end


  # Build a fresh, fully materialised config hash. Every call rebuilds the
  # whole structure, so prefer shared_config unless you need a private copy
  # you intend to mutate.
  def self.make_config
    {
      "main" => {
        "name" => "ProxmintFreeProxy",
        "slug" => "proxmint-free-proxy",
        "version" => "0.0.1",
        "target" => "rb",
      },
      "feature" => {
        "ratelimit" => {
          "options" => {
            "active" => false,
            "burst" => 5,
            "rate" => 5,
          },
          "optspec" => {
            "now" => "`$FUNCTION`",
            "sleep" => "`$FUNCTION`",
          },
          "strict" => false,
          "transport" => "wrap",
        },
        "retry" => {
          "options" => {
            "active" => false,
            "factor" => 2,
            "maxDelay" => 2000,
            "minDelay" => 50,
            "retries" => 2,
            "statuses" => [
              408,
              425,
              429,
              500,
              502,
              503,
              504,
            ],
          },
          "optspec" => {
            "jitter" => "`$BOOLEAN`",
            "sleep" => "`$FUNCTION`",
          },
          "strict" => false,
          "transport" => "wrap",
        },
        "test" => {
          "options" => {
            "active" => false,
          },
          "optspec" => {
            "entity" => "`$MAP`",
            "net" => "`$MAP`",
          },
          "strict" => false,
          "transport" => "base",
        },
        "timeout" => {
          "options" => {
            "active" => false,
            "ms" => 30000,
          },
          "optspec" => {
            "clearTimer" => "`$FUNCTION`",
            "now" => "`$FUNCTION`",
            "setTimer" => "`$FUNCTION`",
          },
          "strict" => false,
          "transport" => "wrap",
        },
      },
      "options" => {
        "base" => "https://proxmint.com",
        "auth" => {
          "prefix" => "Bearer",
        },
        "headers" => {
          "content-type" => "application/json",
        },
        "entity" => {
          "account" => {},
          "free_proxy" => {},
          "geo_ip" => {},
          "usage" => {},
        },
      },
      "entity" => {
        "account" => {
          "fields" => [
            {
              "name" => "bandwidth",
              "title" => "Bandwidth",
              "type" => "`$OBJECT`",
              "req" => true,
            },
            {
              "name" => "billing",
              "title" => "Billing",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "id",
              "title" => "Id",
              "type" => "`$STRING`",
              "req" => true,
              "short" => "Stable product id; matches `productId` in usage rows.",
            },
            {
              "name" => "name",
              "title" => "Name",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "product",
              "title" => "Product",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "proxy",
              "title" => "Proxy",
              "type" => "`$OBJECT`",
              "req" => true,
              "short" => "Everything a client needs to connect.",
            },
            {
              "name" => "status",
              "title" => "Status",
              "type" => "`$STRING`",
              "req" => true,
              "short" => "`expired` means the bandwidth is used up — packs never expire by date.",
            },
          ],
          "id" => {
            "field" => "id",
            "name" => "id",
          },
          "name" => "account",
          "op" => {
            "list" => {
              "input" => "data",
              "name" => "list",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/account",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "account",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "account",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.products`",
                  },
                  "args" => {},
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
        "free_proxy" => {
          "fields" => [
            {
              "name" => "anonymity",
              "title" => "Anonymity",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "countryCode",
              "title" => "Country Code",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
              "short" => "ISO 3166-1 alpha-2, lowercase.",
            },
            {
              "name" => "countryName",
              "title" => "Country Name",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "ip",
              "title" => "Ip",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "lastCheckedAt",
              "title" => "Last Checked At",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
              "format" => "date-time",
            },
            {
              "name" => "latencyMs",
              "title" => "Latency Ms",
              "type" => [
                "`$ONE`",
                [
                  "`$INTEGER`",
                  "`$NULL`",
                ],
              ],
              "short" => "Measured on the last successful check.",
            },
            {
              "name" => "port",
              "title" => "Port",
              "type" => "`$INTEGER`",
              "req" => true,
            },
            {
              "name" => "protocol",
              "title" => "Protocol",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "score",
              "title" => "Score",
              "type" => "`$NUMBER`",
              "req" => true,
              "short" => "Ranking blend of uptime and latency.",
            },
            {
              "name" => "uptimePct",
              "title" => "Uptime Pct",
              "type" => "`$NUMBER`",
              "req" => true,
              "short" => "Share of checks this proxy has answered.",
            },
          ],
          "name" => "free_proxy",
          "op" => {
            "list" => {
              "input" => "data",
              "name" => "list",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/free-proxies",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "free-proxies",
                    },
                  ],
                  "parts" => [
                    "api",
                    "free-proxies",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.rows`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "anonymity",
                        "orig" => "anonymity",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "field" => true,
                      },
                      {
                        "name" => "country",
                        "orig" => "country",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "de",
                      },
                      {
                        "name" => "format",
                        "orig" => "format",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "json",
                      },
                      {
                        "name" => "page",
                        "orig" => "page",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                        "example" => 1,
                      },
                      {
                        "name" => "page_size",
                        "orig" => "pageSize",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                        "example" => 50,
                      },
                      {
                        "name" => "protocol",
                        "orig" => "protocol",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "field" => true,
                      },
                      {
                        "name" => "sort",
                        "orig" => "sort",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "score",
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "alternatives" => [
                      {
                        "kind" => "raw",
                        "media" => "text/plain",
                      },
                    ],
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
        "geo_ip" => {
          "fields" => [
            {
              "name" => "accuracyRadiusKm",
              "title" => "Accuracy Radius Km",
              "type" => [
                "`$ONE`",
                [
                  "`$INTEGER`",
                  "`$NULL`",
                ],
              ],
              "short" => "Radius around lat/lon, in km.",
            },
            {
              "name" => "asn",
              "title" => "Asn",
              "type" => [
                "`$ONE`",
                [
                  "`$INTEGER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "asnOrg",
              "title" => "Asn Org",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "city",
              "title" => "City",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "countryCode",
              "title" => "Country Code",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
              "short" => "ISO 3166-1 alpha-2, lowercase.",
            },
            {
              "name" => "countryName",
              "title" => "Country Name",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "ip",
              "title" => "Ip",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "lat",
              "title" => "Lat",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "lon",
              "title" => "Lon",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "region",
              "title" => "Region",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
              "short" => "First subdivision — English name, else ISO code.",
            },
            {
              "name" => "tz",
              "title" => "Tz",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
              "short" => "IANA timezone, e.g.",
            },
          ],
          "name" => "geo_ip",
          "op" => {
            "load" => {
              "input" => "data",
              "name" => "load",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/geoip",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "geoip",
                    },
                  ],
                  "parts" => [
                    "api",
                    "geoip",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "ip",
                        "orig" => "ip",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "8.8.8.8",
                        "field" => true,
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
        "usage" => {
          "fields" => [
            {
              "name" => "bytes",
              "title" => "Bytes",
              "type" => "`$INTEGER`",
              "req" => true,
            },
            {
              "name" => "day",
              "title" => "Day",
              "type" => "`$STRING`",
              "req" => true,
              "format" => "date",
            },
            {
              "name" => "product",
              "title" => "Product",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "productId",
              "title" => "Product Id",
              "type" => "`$STRING`",
              "req" => true,
            },
            {
              "name" => "requests",
              "title" => "Requests",
              "type" => "`$INTEGER`",
              "req" => true,
            },
          ],
          "name" => "usage",
          "op" => {
            "list" => {
              "input" => "data",
              "name" => "list",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/usage",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "usage",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "usage",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.usage`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "day",
                        "orig" => "days",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                        "example" => 30,
                        "field" => true,
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
      },
    }
  end


  def self.make_feature(name)
    require_relative 'features'
    ProxmintFreeProxyFeatures.make_feature(name)
  end
end
