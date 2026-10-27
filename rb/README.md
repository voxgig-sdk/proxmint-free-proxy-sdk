# ProxmintFreeProxy Ruby SDK



The Ruby SDK for the ProxmintFreeProxy API — an entity-oriented client using idiomatic Ruby conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.Account` — with named operations (`list`/`load`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to RubyGems. Install it from the
GitHub release tag (`rb/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/proxmint-free-proxy-sdk/tags)), or
from a clone:

```bash
git clone https://github.com/voxgig-sdk/proxmint-free-proxy-sdk
```

Then add it to your `Gemfile` by path, and run `bundle install`:

```ruby
gem "voxgig-sdk-proxmint-free-proxy-sdk", path: "./proxmint-free-proxy-sdk/rb"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ruby
require_relative "ProxmintFreeProxy_sdk"

client = ProxmintFreeProxySDK.new({
  "apikey" => ENV["PROXMINT_FREE_PROXY_APIKEY"],
})
```

### 2. List account records

```ruby
begin
  # list returns an Array of Account entities, one per record; data_get reads the record.
  accounts = client.Account.list
  accounts.each do |item|
    record = item.data_get
    puts "#{record["id"]} #{record["bandwidth"]}"
  end
rescue => err
  warn "list failed: #{err}"
end
```


## Error handling

Entity operations raise on failure, so rescue them:

```ruby
begin
  accounts = client.Account.list()
rescue => err
  warn "list failed: #{err}"
end
```

`direct` does **not** raise — it returns the result hash. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example_id" },
})

warn "request failed: #{result["err"] || "HTTP #{result["status"]}"}" unless result["ok"]
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})

if result["ok"]
  puts result["status"]  # 200
  puts result["data"]    # response body
else
  # On an HTTP error status there is no err (only a transport failure sets
  # it), so fall back to the status code.
  warn(result["err"] || "HTTP #{result["status"]}")
end
```

### Prepare a request without sending it

```ruby
begin
  fetchdef = client.prepare({
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => { "id" => "example" },
  })
  puts fetchdef["url"]
  puts fetchdef["method"]
  puts fetchdef["headers"]
rescue => err
  warn "prepare failed: #{err}"
end
```

### Use test mode

Create a mock client for unit testing — no server required:

```ruby
client = ProxmintFreeProxySDK.test

# list returns an Array of Account entities, one per mock record (raises on
# error); data_get reads each record.
accounts = client.Account.list()
accounts.each { |item| puts item.data_get }
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```ruby
mock_fetch = ->(url, init) {
  return {
    "status" => 200,
    "statusText" => "OK",
    "headers" => {},
    "json" => ->() { { "id" => "mock01" } },
  }, nil
}

client = ProxmintFreeProxySDK.new({
  "base" => "http://localhost:8080",
  "system" => {
    "fetch" => mock_fetch,
  },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
PROXMINT_FREE_PROXY_TEST_LIVE=TRUE
PROXMINT_FREE_PROXY_APIKEY=<your-key>
```

Then run:

```bash
cd rb && ruby -Itest -e "Dir['test/*_test.rb'].each { |f| require_relative f }"
```


## Reference

### ProxmintFreeProxySDK

```ruby
require_relative "ProxmintFreeProxy_sdk"
client = ProxmintFreeProxySDK.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `String` | API key for authentication. |
| `base` | `String` | Base URL of the API server. |
| `prefix` | `String` | URL path prefix prepended to all requests. |
| `suffix` | `String` | URL path suffix appended to all requests. |
| `feature` | `Hash` | Feature activation flags. |
| `extend` | `Hash` | Additional Feature instances to load. |
| `system` | `Hash` | System overrides (e.g. custom `fetch` lambda). |

### test

```ruby
client = ProxmintFreeProxySDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### ProxmintFreeProxySDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> Hash` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> Hash` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> Hash` | Build and send an HTTP request. Returns a result hash (`result["ok"]`); does not raise. |
| `Account` | `(data) -> AccountEntity` | Create an Account entity instance. |
| `FreeProxy` | `(data) -> FreeProxyEntity` | Create a FreeProxy entity instance. |
| `GeoIp` | `(data) -> GeoIpEntity` | Create a GeoIp entity instance. |
| `Usage` | `(data) -> UsageEntity` | Create an Usage entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch = nil, ctrl) -> Array` | List entities matching the criteria (call with no argument to list all), one per record. Raises on error. |
| `data_get` | `() -> Hash` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> Hash` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> String` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `Array` of entities, one
per record; an entity's `data_get` reads its record. On failure they raise a
`ProxmintFreeProxyError` (a `StandardError` subclass), so wrap calls in
`begin`/`rescue` where you need to handle errors.

The `direct` escape hatch is the exception: it never raises and instead
returns a result `Hash` with these keys:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `Boolean` | `true` if the HTTP status is 2xx. |
| `status` | `Integer` | HTTP status code. |
| `headers` | `Hash` | Response headers. |
| `data` | `any` | Parsed JSON response body. |
| `err` | `Error` | Present when `ok` is `false`. |

### Entities

#### Account

| Field | Description |
| --- | --- |
| `bandwidth` |  |
| `billing` |  |
| `id` | Stable product id; matches `productId` in usage rows. |
| `name` |  |
| `product` |  |
| `proxy` | Everything a client needs to connect. |
| `status` | `expired` means the bandwidth is used up — packs never expire by date. |

Operations: List.

API path: `/api/v1/account`

#### FreeProxy

| Field | Description |
| --- | --- |
| `anonymity` |  |
| `countryCode` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` |  |
| `ip` |  |
| `lastCheckedAt` |  |
| `latencyMs` | Measured on the last successful check. |
| `port` |  |
| `protocol` |  |
| `score` | Ranking blend of uptime and latency. |
| `uptimePct` | Share of checks this proxy has answered. |

Operations: List.

API path: `/api/free-proxies`

#### GeoIp

| Field | Description |
| --- | --- |
| `accuracyRadiusKm` | Radius around lat/lon, in km. |
| `asn` |  |
| `asnOrg` |  |
| `city` |  |
| `countryCode` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` |  |
| `ip` |  |
| `lat` |  |
| `lon` |  |
| `region` | First subdivision — English name, else ISO code. |
| `tz` | IANA timezone, e.g. |

Operations: Load.

API path: `/api/geoip`

#### Usage

| Field | Description |
| --- | --- |
| `bytes` |  |
| `day` |  |
| `product` |  |
| `productId` |  |
| `requests` |  |

Operations: List.

API path: `/api/v1/usage`



## Entities


### Account

Create an instance: `account = client.Account`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `bandwidth` | `Hash` |  |
| `billing` | `String` |  |
| `id` | `String` | Stable product id; matches `productId` in usage rows. |
| `name` | `String` |  |
| `product` | `String` |  |
| `proxy` | `Hash` | Everything a client needs to connect. |
| `status` | `String` | `expired` means the bandwidth is used up — packs never expire by date. |

#### Example: List

```ruby
# list returns an Array of Account entities, one per record (raises on error).
accounts = client.Account.list
accounts.each { |item| puts item.data_get }
```


### FreeProxy

Create an instance: `free_proxy = client.FreeProxy`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `anonymity` | `Object` |  |
| `countryCode` | `Object` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` | `Object` |  |
| `ip` | `String` |  |
| `lastCheckedAt` | `Object` |  |
| `latencyMs` | `Object` | Measured on the last successful check. |
| `port` | `Integer` |  |
| `protocol` | `String` |  |
| `score` | `Float` | Ranking blend of uptime and latency. |
| `uptimePct` | `Float` | Share of checks this proxy has answered. |

#### Example: List

```ruby
# list returns an Array of FreeProxy entities, one per record (raises on error).
free_proxys = client.FreeProxy.list
free_proxys.each { |item| puts item.data_get }
```


### GeoIp

Create an instance: `geo_ip = client.GeoIp`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `accuracyRadiusKm` | `Object` | Radius around lat/lon, in km. |
| `asn` | `Object` |  |
| `asnOrg` | `Object` |  |
| `city` | `Object` |  |
| `countryCode` | `Object` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` | `Object` |  |
| `ip` | `String` |  |
| `lat` | `Object` |  |
| `lon` | `Object` |  |
| `region` | `Object` | First subdivision — English name, else ISO code. |
| `tz` | `Object` | IANA timezone, e.g. |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the GeoIp record (raises on error).
geo_ip = client.GeoIp.load()
```


### Usage

Create an instance: `usage = client.Usage`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `bytes` | `Integer` |  |
| `day` | `String` |  |
| `product` | `String` |  |
| `productId` | `String` |  |
| `requests` | `Integer` |  |

#### Example: List

```ruby
# list returns an Array of Usage entities, one per record (raises on error).
usages = client.Usage.list
usages.each { |item| puts item.data_get }
```

## Features

This SDK ships 4 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is a Ruby class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as hashes

The Ruby SDK uses plain Ruby hashes throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers.to_map()` to safely validate that a value is a hash.

### Module structure

```
rb/
├── ProxmintFreeProxy_sdk.rb       -- Main SDK module
├── config.rb                  -- Configuration
├── schema.rb                  -- Generated option + entity specs
├── features.rb                -- Feature factory
├── core/                      -- Core types and context
├── entity/                    -- Entity implementations
├── feature/                   -- Built-in features (Base, Test, Log)
├── utility/                   -- Utility functions and struct library
└── test/                      -- Test suites
```

The main module (`ProxmintFreeProxy_sdk`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```ruby
account = client.Account
account.list()

# account.data_get now returns the account data from the last list
# account.match_get returns the last match criteria
```

Call `make` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
