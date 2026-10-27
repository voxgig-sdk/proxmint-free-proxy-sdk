# ProxmintFreeProxy SDK utility: make_context

from projectname_sdk.core.context import ProxmintFreeProxyContext


def make_context_util(ctxmap, basectx):
    return ProxmintFreeProxyContext(ctxmap, basectx)
