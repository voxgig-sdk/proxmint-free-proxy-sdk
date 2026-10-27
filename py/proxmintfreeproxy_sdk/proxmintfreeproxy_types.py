# Typed models for the ProxmintFreeProxy SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Account(TypedDict):
    bandwidth: dict
    billing: str
    id: str
    name: str
    product: str
    proxy: dict
    status: str


class AccountListMatch(TypedDict, total=False):
    bandwidth: dict
    billing: str
    id: str
    name: str
    product: str
    proxy: dict
    status: str


class FreeProxyRequired(TypedDict):
    ip: str
    port: int
    protocol: str
    score: float
    uptimePct: float


class FreeProxy(FreeProxyRequired, total=False):
    anonymity: str | None
    countryCode: str | None
    countryName: str | None
    lastCheckedAt: str | None
    latencyMs: int | None


class FreeProxyListMatch(TypedDict, total=False):
    anonymity: str
    country: str
    format: str
    page: int
    page_size: int
    protocol: str
    sort: str


class GeoIpRequired(TypedDict):
    ip: str


class GeoIp(GeoIpRequired, total=False):
    accuracyRadiusKm: int | None
    asn: int | None
    asnOrg: str | None
    city: str | None
    countryCode: str | None
    countryName: str | None
    lat: float | None
    lon: float | None
    region: str | None
    tz: str | None


class GeoIpLoadMatch(TypedDict, total=False):
    ip: str


class Usage(TypedDict):
    bytes: int
    day: str
    product: str
    productId: str
    requests: int


class UsageListMatch(TypedDict, total=False):
    day: int
