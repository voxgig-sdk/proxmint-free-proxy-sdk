# ProxmintFreeProxy Lua SDK



The Lua SDK for the ProxmintFreeProxy API — an entity-oriented client using Lua conventions.

It exposes the API as capitalised, semantic **Entities** — e.g. `client:Account()` — each with the same small set of operations (`list`, `load`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to LuaRocks. Install it from the
GitHub release tag (`lua/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/proxmint-free-proxy-sdk/tags)),
or add the source directory to your `LUA_PATH`:

```bash
export LUA_PATH="path/to/lua/?.lua;path/to/lua/?/init.lua;;"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```lua
local sdk = require("proxmint-free-proxy_sdk")

local client = sdk.new({
  apikey = os.getenv("PROXMINT_FREE_PROXY_APIKEY"),
})
```

### 2. List account records

Entity operations return `(value, err)`. For `list`, `value` is an
array of entities, one per record — iterate it directly (there is no
wrapper), and read each record with `data_get()`.

```lua
local accounts, err = client:Account():list()
if err then error(err) end

for _, item in ipairs(accounts) do
  local rec = item:data_get()
  print(rec["id"])
end
```


## Error handling

Entity operations return `(value, err)`. Check `err` before using
the value:

```lua
local accounts, err = client:Account():list()
if err then error(err) end
```

`direct` follows the same `(value, err)` convention:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example_id" },
})
if err then error(err) end
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
if err then error(err) end

if result["ok"] then
  print(result["status"])  -- 200
  print(result["data"])    -- response body
end
```

### Prepare a request without sending it

```lua
local fetchdef, err = client:prepare({
  path = "/api/resource/{id}",
  method = "DELETE",
  params = { id = "example" },
})
if err then error(err) end

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```lua
local client = sdk.test()

local result, err = client:Account():list()
-- result is an array of entities, one per mock record; err is set on failure
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```lua
local function mock_fetch(url, init)
  return {
    status = 200,
    statusText = "OK",
    headers = {},
    json = function()
      return { id = "mock01" }
    end,
  }, nil
end

local client = sdk.new({
  base = "http://localhost:8080",
  system = {
    fetch = mock_fetch,
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
cd lua && busted test/
```


## Reference

### ProxmintFreeProxySDK

```lua
local sdk = require("proxmint-free-proxy_sdk")
local client = sdk.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `table` | Feature activation flags. |
| `extend` | `table` | Additional Feature instances to load. |
| `system` | `table` | System overrides (e.g. custom `fetch` function). |

### test

```lua
local client = sdk.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### ProxmintFreeProxySDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> table` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> table, err` | Build an HTTP request definition without sending. |
| `direct` | `(fetchargs) -> table, err` | Build and send an HTTP request. |
| `Account` | `(data) -> AccountEntity` | Create an Account entity instance. |
| `FreeProxy` | `(data) -> FreeProxyEntity` | Create a FreeProxy entity instance. |
| `GeoIp` | `(data) -> GeoIpEntity` | Create a GeoIp entity instance. |
| `Usage` | `(data) -> UsageEntity` | Create an Usage entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any, err` | Load a single entity by match criteria, and return it. |
| `list` | `(reqmatch, ctrl) -> any, err` | List entities matching the criteria, one per record. |
| `data_get` | `() -> table` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> table` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> string` | Return the entity name. |

### Result shape

Entity operations return `(value, err)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `load` | the entity, whose `data_get()` reads its record (a `table`) |
| `list` | an array (`table`) of entities, one per record |

Check `err` first (it is non-`nil` on failure), then use `value`:

    local geo_ip, err = client:GeoIp():load()
    if err then error(err) end
    -- geo_ip is the loaded entity

Only `direct()` returns a response envelope — a `table` with `ok`,
`status`, `headers`, and `data` keys.

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

Create an instance: `local account = client:Account(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `bandwidth` | `table` |  |
| `billing` | `string` |  |
| `id` | `string` | Stable product id; matches `productId` in usage rows. |
| `name` | `string` |  |
| `product` | `string` |  |
| `proxy` | `table` | Everything a client needs to connect. |
| `status` | `string` | `expired` means the bandwidth is used up — packs never expire by date. |

#### Example: List

```lua
local accounts, err = client:Account():list()
```


### FreeProxy

Create an instance: `local free_proxy = client:FreeProxy(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `anonymity` | `string|nil` |  |
| `countryCode` | `string|nil` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` | `string|nil` |  |
| `ip` | `string` |  |
| `lastCheckedAt` | `string|nil` |  |
| `latencyMs` | `number|nil` | Measured on the last successful check. |
| `port` | `number` |  |
| `protocol` | `string` |  |
| `score` | `number` | Ranking blend of uptime and latency. |
| `uptimePct` | `number` | Share of checks this proxy has answered. |

#### Example: List

```lua
local free_proxys, err = client:FreeProxy():list()
```


### GeoIp

Create an instance: `local geo_ip = client:GeoIp(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `accuracyRadiusKm` | `number|nil` | Radius around lat/lon, in km. |
| `asn` | `number|nil` |  |
| `asnOrg` | `string|nil` |  |
| `city` | `string|nil` |  |
| `countryCode` | `string|nil` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` | `string|nil` |  |
| `ip` | `string` |  |
| `lat` | `number|nil` |  |
| `lon` | `number|nil` |  |
| `region` | `string|nil` | First subdivision — English name, else ISO code. |
| `tz` | `string|nil` | IANA timezone, e.g. |

#### Example: Load

```lua
local geo_ip, err = client:GeoIp():load()
```


### Usage

Create an instance: `local usage = client:Usage(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `bytes` | `number` |  |
| `day` | `string` |  |
| `product` | `string` |  |
| `productId` | `string` |  |
| `requests` | `number` |  |

#### Example: List

```lua
local usages, err = client:Usage():list()
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

Features are the extension mechanism. A feature is a Lua table
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as tables

The Lua SDK uses plain Lua tables throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a table.

### Module structure

```
lua/
├── proxmint-free-proxy_sdk.lua    -- Main SDK module
├── config.lua               -- Configuration
├── schema.lua               -- Generated option + entity specs
├── features.lua             -- Feature factory
├── core/                    -- Core types and context
├── entity/                  -- Entity implementations
├── feature/                 -- Built-in features (Base, Test, Log)
├── utility/                 -- Utility functions and struct library
└── test/                    -- Test suites
```

The main module (`proxmint-free-proxy_sdk`) exports the SDK constructor
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```lua
local account = client:Account()
account:list()

-- account:data_get() now returns the account data from the last list
-- account:match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
