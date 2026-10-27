# Proxmint API

> Two kinds of endpoint. The free proxy list and IP geolocation are open and key-free: rate limited per IP and sent with `access-control-allow-origin: *`, so they work from a browser as well as a server. The proxy list is published under CC BY 4.0, attribution is the only condition.
>
> The customer API under `/api/v1` is read-only and needs an API key, created under Settings in the dashboard and sent as `Authorization: Bearer &lt;key&gt;`. It returns proxy credentials, so it sends no CORS headers: call it from a server, never from browser code.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 4 entities and 4 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Account

Results: The account behind the key.

SDK operations: `list`.

Key fields to recognise:

- `id`: Stable product id; matches `productId` in usage rows.
- `proxy`: Everything a client needs to connect.
- `status`: `expired` means the bandwidth is used up, packs never expire by date.

### FreeProxy

Results: A page of live proxies.

SDK operations: `list`.

Key fields to recognise:

- `countryCode`: ISO 3166-1 alpha-2, lowercase.
- `latencyMs`: Measured on the last successful check.
- `score`: Ranking blend of uptime and latency.
- `uptimePct`: Share of checks this proxy has answered.

### GeoIp

Results: What is known about the address. Fields are null where the database has no value.

SDK operations: `load`.

Key fields to recognise:

- `accuracyRadiusKm`: Radius around lat/lon, in km.
- `countryCode`: ISO 3166-1 alpha-2, lowercase.
- `region`: First subdivision, English name, else ISO code.
- `tz`: IANA timezone, for example America/`New_York`.

### Usage

Results: Usage rows for the window.

SDK operations: `list`.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Account | `list` | `GET /api/v1/account` | Required |
| FreeProxy | `list` | `GET /api/free-proxies` | See reference |
| GeoIp | `load` | `GET /api/geoip` | See reference |
| Usage | `list` | `GET /api/v1/usage` | Required |

## Connect to the API

- API server: `https://proxmint.com`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

An API key (`pmk_…`) from Settings in the dashboard. Read-only.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `proxmint-free-proxy_list`: List records for an entity. Supported entities: `account`, `free_proxy`, `usage`.
- `proxmint-free-proxy_load`: Load one record for an entity. Supported entities: `geo_ip`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

