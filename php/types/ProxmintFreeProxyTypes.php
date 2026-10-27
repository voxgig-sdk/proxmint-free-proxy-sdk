<?php
declare(strict_types=1);

// Typed models for the ProxmintFreeProxy SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Account entity data model. */
class Account
{
    public array $bandwidth;
    public string $billing;
    public string $id;
    public string $name;
    public string $product;
    public array $proxy;
    public string $status;
}

/** Request payload for Account#list. */
class AccountListMatch
{
    public ?array $bandwidth = null;
    public ?string $billing = null;
    public ?string $id = null;
    public ?string $name = null;
    public ?string $product = null;
    public ?array $proxy = null;
    public ?string $status = null;
}

/** FreeProxy entity data model. */
class FreeProxy
{
    public mixed $anonymity = null;
    public mixed $countryCode = null;
    public mixed $countryName = null;
    public string $ip;
    public mixed $lastCheckedAt = null;
    public mixed $latencyMs = null;
    public int $port;
    public string $protocol;
    public float $score;
    public float $uptimePct;
}

/** Request payload for FreeProxy#list. */
class FreeProxyListMatch
{
    public ?string $anonymity = null;
    public ?string $country = null;
    public ?string $format = null;
    public ?int $page = null;
    public ?int $page_size = null;
    public ?string $protocol = null;
    public ?string $sort = null;
}

/** GeoIp entity data model. */
class GeoIp
{
    public mixed $accuracyRadiusKm = null;
    public mixed $asn = null;
    public mixed $asnOrg = null;
    public mixed $city = null;
    public mixed $countryCode = null;
    public mixed $countryName = null;
    public string $ip;
    public mixed $lat = null;
    public mixed $lon = null;
    public mixed $region = null;
    public mixed $tz = null;
}

/** Request payload for GeoIp#load. */
class GeoIpLoadMatch
{
    public ?string $ip = null;
}

/** Usage entity data model. */
class Usage
{
    public int $bytes;
    public string $day;
    public string $product;
    public string $productId;
    public int $requests;
}

/** Request payload for Usage#list. */
class UsageListMatch
{
    public ?int $day = null;
}

