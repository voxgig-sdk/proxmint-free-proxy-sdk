# ProxmintFreeProxy Python SDK



The Python SDK for the ProxmintFreeProxy API — an entity-oriented client following Pythonic conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.Account()` — each
carrying a small, uniform set of operations (`list`, `load`) instead of raw URL
paths and query strings. You work with named resources and verbs, which
keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to PyPI. Install it from the GitHub
release tag (`py/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/proxmint-free-proxy-sdk/tags)) or
from a source checkout:

```bash
pip install -e .
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```python
import os
from proxmintfreeproxy_sdk import ProxmintFreeProxySDK

client = ProxmintFreeProxySDK({
    "apikey": os.environ.get("PROXMINT_FREE_PROXY_APIKEY"),
})
```

### 2. List account records

`list()` returns a `list` of entities, one per record, and raises on
error; an entity's `data_get()` reads its record (a `dict`).

```python
try:
    accounts = client.Account().list()
    for account in accounts:
        print(account.data_get())
except Exception as err:
    print(f"list failed: {err}")
```


## Error handling

Entity operations raise on failure, so wrap them in `try` / `except`:

```python
try:
    accounts = client.Account().list()
    print([item.data_get() for item in accounts])
except Exception as err:
    print(f"list failed: {err}")
```

`direct()` does **not** raise — it returns the result envelope. Branch
on `ok`; on failure `status` holds the HTTP status (for error responses)
and `err` holds a transport error, so read both defensively:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example_id"},
})

if not result["ok"]:
    print("request failed:", result.get("status"), result.get("err"))
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})

if result["ok"]:
    print(result["status"])  # 200
    print(result["data"])    # response body
else:
    # A non-2xx response carries status + data (the error body); a
    # transport-level failure carries err instead. Only one is present, so
    # read both with .get() rather than indexing a key that may be absent.
    print(result.get("status"), result.get("err"))
```

### Prepare a request without sending it

```python
# prepare() returns the fetch definition and raises on error.
fetchdef = client.prepare({
    "path": "/api/resource/{id}",
    "method": "DELETE",
    "params": {"id": "example"},
})

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```python
client = ProxmintFreeProxySDK.test()

# Entity ops return the entity, and list one per record; they raise on error.
account = client.Account().list()
# data_get() on an entity reads its mock response record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```python
def mock_fetch(url, init):
    return {
        "status": 200,
        "statusText": "OK",
        "headers": {},
        "json": lambda: {"id": "mock01"},
    }, None

client = ProxmintFreeProxySDK({
    "base": "http://localhost:8080",
    "system": {
        "fetch": mock_fetch,
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
cd py && pytest test/
```


## Reference

### ProxmintFreeProxySDK

```python
from proxmintfreeproxy_sdk import ProxmintFreeProxySDK

client = ProxmintFreeProxySDK(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `str` | API key for authentication. |
| `base` | `str` | Base URL of the API server. |
| `prefix` | `str` | URL path prefix prepended to all requests. |
| `suffix` | `str` | URL path suffix appended to all requests. |
| `feature` | `dict` | Feature activation flags. |
| `extend` | `list` | Additional Feature instances to load. |
| `system` | `dict` | System overrides (e.g. custom `fetch` function). |

### test

```python
client = ProxmintFreeProxySDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `None`.

### ProxmintFreeProxySDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> dict` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> dict` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> dict` | Build and send an HTTP request. Returns a result dict (branch on `ok`). |
| `Account` | `(data) -> AccountEntity` | Create an Account entity instance. |
| `FreeProxy` | `(data) -> FreeProxyEntity` | Create a FreeProxy entity instance. |
| `GeoIp` | `(data) -> GeoIpEntity` | Create a GeoIp entity instance. |
| `Usage` | `(data) -> UsageEntity` | Create an Usage entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch, ctrl) -> list` | List entities matching the criteria, one per record. Raises on error. |
| `data_get` | `() -> dict` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> dict` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> str` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` a `list` of entities, one
per record; an entity's `data_get()` reads its record (a `dict`). They raise
on error, so wrap calls in `try`/`except` to handle failures.

The `direct()` escape hatch never raises — it returns a result `dict`
you branch on via `result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `True` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `dict` | Response headers. |
| `data` | `any` | Parsed JSON response body. |

On error, `ok` is `False` and `err` contains the error value.

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

Create an instance: `account = client.Account()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `bandwidth` | `dict` |  |
| `billing` | `str` |  |
| `id` | `str` | Stable product id; matches `productId` in usage rows. |
| `name` | `str` |  |
| `product` | `str` |  |
| `proxy` | `dict` | Everything a client needs to connect. |
| `status` | `str` | `expired` means the bandwidth is used up — packs never expire by date. |

#### Example: List

```python
accounts = client.Account().list()
```


### FreeProxy

Create an instance: `free_proxy = client.FreeProxy()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `anonymity` | `str | None` |  |
| `countryCode` | `str | None` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` | `str | None` |  |
| `ip` | `str` |  |
| `lastCheckedAt` | `str | None` |  |
| `latencyMs` | `int | None` | Measured on the last successful check. |
| `port` | `int` |  |
| `protocol` | `str` |  |
| `score` | `float` | Ranking blend of uptime and latency. |
| `uptimePct` | `float` | Share of checks this proxy has answered. |

#### Example: List

```python
free_proxys = client.FreeProxy().list()
```


### GeoIp

Create an instance: `geo_ip = client.GeoIp()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `accuracyRadiusKm` | `int | None` | Radius around lat/lon, in km. |
| `asn` | `int | None` |  |
| `asnOrg` | `str | None` |  |
| `city` | `str | None` |  |
| `countryCode` | `str | None` | ISO 3166-1 alpha-2, lowercase. |
| `countryName` | `str | None` |  |
| `ip` | `str` |  |
| `lat` | `float | None` |  |
| `lon` | `float | None` |  |
| `region` | `str | None` | First subdivision — English name, else ISO code. |
| `tz` | `str | None` | IANA timezone, e.g. |

#### Example: Load

```python
geo_ip = client.GeoIp().load()
```


### Usage

Create an instance: `usage = client.Usage()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `bytes` | `int` |  |
| `day` | `str` |  |
| `product` | `str` |  |
| `productId` | `str` |  |
| `requests` | `int` |  |

#### Example: List

```python
usages = client.Usage().list()
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

Features are the extension mechanism. A feature is a Python class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as dicts

The Python SDK uses plain dicts throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a dict.

### Module structure

```
py/
├── proxmintfreeproxy_sdk.py         -- Main SDK module
├── config.py                    -- Configuration
├── schema.py                    -- Generated option + entity specs
├── features.py                  -- Feature factory
├── core/                        -- Core types and context
├── entity/                      -- Entity implementations
├── feature/                     -- Built-in features (Base, Test, Log)
├── utility/                     -- Utility functions and struct library
└── test/                        -- Test suites
```

The main module (`proxmintfreeproxy_sdk`) exports the SDK class.
Import entity or utility modules directly only when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```python
account = client.Account()
account.list()

# account.data_get() now returns the account data from the last list
# account.match_get() returns the last match criteria
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
