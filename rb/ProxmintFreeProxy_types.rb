# frozen_string_literal: true

# Typed models for the ProxmintFreeProxy SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Account entity data model.
#
# @!attribute [rw] bandwidth
#   @return [Hash]
#
# @!attribute [rw] billing
#   @return [String]
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] product
#   @return [String]
#
# @!attribute [rw] proxy
#   @return [Hash]
#
# @!attribute [rw] status
#   @return [String]
Account = Struct.new(
  :bandwidth,
  :billing,
  :id,
  :name,
  :product,
  :proxy,
  :status,
  keyword_init: true
)

# Request payload for Account#list.
#
# @!attribute [rw] bandwidth
#   @return [Hash, nil]
#
# @!attribute [rw] billing
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] product
#   @return [String, nil]
#
# @!attribute [rw] proxy
#   @return [Hash, nil]
#
# @!attribute [rw] status
#   @return [String, nil]
AccountListMatch = Struct.new(
  :bandwidth,
  :billing,
  :id,
  :name,
  :product,
  :proxy,
  :status,
  keyword_init: true
)

# FreeProxy entity data model.
#
# @!attribute [rw] anonymity
#   @return [Object, nil]
#
# @!attribute [rw] countryCode
#   @return [Object, nil]
#
# @!attribute [rw] countryName
#   @return [Object, nil]
#
# @!attribute [rw] ip
#   @return [String]
#
# @!attribute [rw] lastCheckedAt
#   @return [Object, nil]
#
# @!attribute [rw] latencyMs
#   @return [Object, nil]
#
# @!attribute [rw] port
#   @return [Integer]
#
# @!attribute [rw] protocol
#   @return [String]
#
# @!attribute [rw] score
#   @return [Float]
#
# @!attribute [rw] uptimePct
#   @return [Float]
FreeProxy = Struct.new(
  :anonymity,
  :countryCode,
  :countryName,
  :ip,
  :lastCheckedAt,
  :latencyMs,
  :port,
  :protocol,
  :score,
  :uptimePct,
  keyword_init: true
)

# Request payload for FreeProxy#list.
#
# @!attribute [rw] anonymity
#   @return [String, nil]
#
# @!attribute [rw] country
#   @return [String, nil]
#
# @!attribute [rw] format
#   @return [String, nil]
#
# @!attribute [rw] page
#   @return [Integer, nil]
#
# @!attribute [rw] page_size
#   @return [Integer, nil]
#
# @!attribute [rw] protocol
#   @return [String, nil]
#
# @!attribute [rw] sort
#   @return [String, nil]
FreeProxyListMatch = Struct.new(
  :anonymity,
  :country,
  :format,
  :page,
  :page_size,
  :protocol,
  :sort,
  keyword_init: true
)

# GeoIp entity data model.
#
# @!attribute [rw] accuracyRadiusKm
#   @return [Object, nil]
#
# @!attribute [rw] asn
#   @return [Object, nil]
#
# @!attribute [rw] asnOrg
#   @return [Object, nil]
#
# @!attribute [rw] city
#   @return [Object, nil]
#
# @!attribute [rw] countryCode
#   @return [Object, nil]
#
# @!attribute [rw] countryName
#   @return [Object, nil]
#
# @!attribute [rw] ip
#   @return [String]
#
# @!attribute [rw] lat
#   @return [Object, nil]
#
# @!attribute [rw] lon
#   @return [Object, nil]
#
# @!attribute [rw] region
#   @return [Object, nil]
#
# @!attribute [rw] tz
#   @return [Object, nil]
GeoIp = Struct.new(
  :accuracyRadiusKm,
  :asn,
  :asnOrg,
  :city,
  :countryCode,
  :countryName,
  :ip,
  :lat,
  :lon,
  :region,
  :tz,
  keyword_init: true
)

# Request payload for GeoIp#load.
#
# @!attribute [rw] ip
#   @return [String, nil]
GeoIpLoadMatch = Struct.new(
  :ip,
  keyword_init: true
)

# Usage entity data model.
#
# @!attribute [rw] bytes
#   @return [Integer]
#
# @!attribute [rw] day
#   @return [String]
#
# @!attribute [rw] product
#   @return [String]
#
# @!attribute [rw] productId
#   @return [String]
#
# @!attribute [rw] requests
#   @return [Integer]
Usage = Struct.new(
  :bytes,
  :day,
  :product,
  :productId,
  :requests,
  keyword_init: true
)

# Request payload for Usage#list.
#
# @!attribute [rw] day
#   @return [Integer, nil]
UsageListMatch = Struct.new(
  :day,
  keyword_init: true
)

