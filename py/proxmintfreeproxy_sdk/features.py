# ProxmintFreeProxy SDK feature factory

from proxmintfreeproxy_sdk.feature.base_feature import ProxmintFreeProxyBaseFeature
from proxmintfreeproxy_sdk.feature.ratelimit_feature import ProxmintFreeProxyRatelimitFeature
from proxmintfreeproxy_sdk.feature.retry_feature import ProxmintFreeProxyRetryFeature
from proxmintfreeproxy_sdk.feature.test_feature import ProxmintFreeProxyTestFeature
from proxmintfreeproxy_sdk.feature.timeout_feature import ProxmintFreeProxyTimeoutFeature


_FEATURES = {
    "base": lambda: ProxmintFreeProxyBaseFeature(),
    "ratelimit": lambda: ProxmintFreeProxyRatelimitFeature(),
    "retry": lambda: ProxmintFreeProxyRetryFeature(),
    "test": lambda: ProxmintFreeProxyTestFeature(),
    "timeout": lambda: ProxmintFreeProxyTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
