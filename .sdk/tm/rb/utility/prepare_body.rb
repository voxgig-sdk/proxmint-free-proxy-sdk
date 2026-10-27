# ProxmintFreeProxy SDK utility: prepare_body
require_relative 'media'
module ProxmintFreeProxyUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return ProxmintFreeProxyUtilities.raw_body(ctx.reqdata) if ProxmintFreeProxyUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
