package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "ProxmintFreeProxy",
			"slug": "proxmint-free-proxy",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"now": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://proxmint.com",
			"auth": map[string]any{
				"prefix": "Bearer",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"account": map[string]any{},
				"free_proxy": map[string]any{},
				"geo_ip": map[string]any{},
				"usage": map[string]any{},
			},
		},
		"entity": map[string]any{
			"account": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "bandwidth",
						"title": "Bandwidth",
						"type": "`$OBJECT`",
						"req": true,
					},
					map[string]any{
						"name": "billing",
						"title": "Billing",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"req": true,
						"short": "Stable product id; matches `productId` in usage rows.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "product",
						"title": "Product",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "proxy",
						"title": "Proxy",
						"type": "`$OBJECT`",
						"req": true,
						"short": "Everything a client needs to connect.",
					},
					map[string]any{
						"name": "status",
						"title": "Status",
						"type": "`$STRING`",
						"req": true,
						"short": "`expired` means the bandwidth is used up — packs never expire by date.",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "account",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/account",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "account",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"account",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.products`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"free_proxy": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "anonymity",
						"title": "Anonymity",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "countryCode",
						"title": "Country Code",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "ISO 3166-1 alpha-2, lowercase.",
					},
					map[string]any{
						"name": "countryName",
						"title": "Country Name",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "ip",
						"title": "Ip",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "lastCheckedAt",
						"title": "Last Checked At",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"format": "date-time",
					},
					map[string]any{
						"name": "latencyMs",
						"title": "Latency Ms",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$INTEGER`",
								"`$NULL`",
							},
						},
						"short": "Measured on the last successful check.",
					},
					map[string]any{
						"name": "port",
						"title": "Port",
						"type": "`$INTEGER`",
						"req": true,
					},
					map[string]any{
						"name": "protocol",
						"title": "Protocol",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "score",
						"title": "Score",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Ranking blend of uptime and latency.",
					},
					map[string]any{
						"name": "uptimePct",
						"title": "Uptime Pct",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Share of checks this proxy has answered.",
					},
				},
				"name": "free_proxy",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/free-proxies",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "free-proxies",
									},
								},
								"parts": []any{
									"api",
									"free-proxies",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.rows`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "anonymity",
											"orig": "anonymity",
											"type": "`$STRING`",
											"kind": "query",
											"field": true,
										},
										map[string]any{
											"name": "country",
											"orig": "country",
											"type": "`$STRING`",
											"kind": "query",
											"example": "de",
										},
										map[string]any{
											"name": "format",
											"orig": "format",
											"type": "`$STRING`",
											"kind": "query",
											"example": "json",
										},
										map[string]any{
											"name": "page",
											"orig": "page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 1,
										},
										map[string]any{
											"name": "page_size",
											"orig": "pageSize",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 50,
										},
										map[string]any{
											"name": "protocol",
											"orig": "protocol",
											"type": "`$STRING`",
											"kind": "query",
											"field": true,
										},
										map[string]any{
											"name": "sort",
											"orig": "sort",
											"type": "`$STRING`",
											"kind": "query",
											"example": "score",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"alternatives": []any{
										map[string]any{
											"kind": "raw",
											"media": "text/plain",
										},
									},
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"geo_ip": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "accuracyRadiusKm",
						"title": "Accuracy Radius Km",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$INTEGER`",
								"`$NULL`",
							},
						},
						"short": "Radius around lat/lon, in km.",
					},
					map[string]any{
						"name": "asn",
						"title": "Asn",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$INTEGER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "asnOrg",
						"title": "Asn Org",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "city",
						"title": "City",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "countryCode",
						"title": "Country Code",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "ISO 3166-1 alpha-2, lowercase.",
					},
					map[string]any{
						"name": "countryName",
						"title": "Country Name",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "ip",
						"title": "Ip",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "lat",
						"title": "Lat",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "lon",
						"title": "Lon",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "region",
						"title": "Region",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "First subdivision — English name, else ISO code.",
					},
					map[string]any{
						"name": "tz",
						"title": "Tz",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "IANA timezone, e.g.",
					},
				},
				"name": "geo_ip",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/geoip",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "geoip",
									},
								},
								"parts": []any{
									"api",
									"geoip",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "ip",
											"orig": "ip",
											"type": "`$STRING`",
											"kind": "query",
											"example": "8.8.8.8",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"usage": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "bytes",
						"title": "Bytes",
						"type": "`$INTEGER`",
						"req": true,
					},
					map[string]any{
						"name": "day",
						"title": "Day",
						"type": "`$STRING`",
						"req": true,
						"format": "date",
					},
					map[string]any{
						"name": "product",
						"title": "Product",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "productId",
						"title": "Product Id",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "requests",
						"title": "Requests",
						"type": "`$INTEGER`",
						"req": true,
					},
				},
				"name": "usage",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/usage",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "usage",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"usage",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.usage`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "day",
											"orig": "days",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 30,
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
