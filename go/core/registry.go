package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewAccountEntityFunc func(client *ProxmintFreeProxySDK, entopts map[string]any) ProxmintFreeProxyEntity

var NewFreeProxyEntityFunc func(client *ProxmintFreeProxySDK, entopts map[string]any) ProxmintFreeProxyEntity

var NewGeoIpEntityFunc func(client *ProxmintFreeProxySDK, entopts map[string]any) ProxmintFreeProxyEntity

var NewUsageEntityFunc func(client *ProxmintFreeProxySDK, entopts map[string]any) ProxmintFreeProxyEntity

