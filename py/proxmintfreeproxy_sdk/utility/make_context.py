# ProxmintFreeProxy SDK utility: make_context

from proxmintfreeproxy_sdk.core.context import ProxmintFreeProxyContext


def make_context_util(ctxmap, basectx):
    return ProxmintFreeProxyContext(ctxmap, basectx)
