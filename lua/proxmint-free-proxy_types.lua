-- Typed models for the ProxmintFreeProxy SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Account
---@field bandwidth table
---@field billing string
---@field id string
---@field name string
---@field product string
---@field proxy table
---@field status string

---@class AccountListMatch
---@field bandwidth? table
---@field billing? string
---@field id? string
---@field name? string
---@field product? string
---@field proxy? table
---@field status? string

---@class FreeProxy
---@field anonymity? string|nil
---@field countryCode? string|nil
---@field countryName? string|nil
---@field ip string
---@field lastCheckedAt? string|nil
---@field latencyMs? number|nil
---@field port number
---@field protocol string
---@field score number
---@field uptimePct number

---@class FreeProxyListMatch
---@field anonymity? string
---@field country? string
---@field format? string
---@field page? number
---@field page_size? number
---@field protocol? string
---@field sort? string

---@class GeoIp
---@field accuracyRadiusKm? number|nil
---@field asn? number|nil
---@field asnOrg? string|nil
---@field city? string|nil
---@field countryCode? string|nil
---@field countryName? string|nil
---@field ip string
---@field lat? number|nil
---@field lon? number|nil
---@field region? string|nil
---@field tz? string|nil

---@class GeoIpLoadMatch
---@field ip? string

---@class Usage
---@field bytes number
---@field day string
---@field product string
---@field productId string
---@field requests number

---@class UsageListMatch
---@field day? number

local M = {}

return M
