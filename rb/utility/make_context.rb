# ProxmintFreeProxy SDK utility: make_context
require_relative '../core/context'
module ProxmintFreeProxyUtilities
  MakeContext = ->(ctxmap, basectx) {
    ProxmintFreeProxyContext.new(ctxmap, basectx)
  }
end
