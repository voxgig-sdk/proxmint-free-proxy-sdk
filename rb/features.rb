# ProxmintFreeProxy SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module ProxmintFreeProxyFeatures
  def self.make_feature(name)
    case name
    when "base"
      ProxmintFreeProxyBaseFeature.new
    when "ratelimit"
      ProxmintFreeProxyRatelimitFeature.new
    when "retry"
      ProxmintFreeProxyRetryFeature.new
    when "test"
      ProxmintFreeProxyTestFeature.new
    when "timeout"
      ProxmintFreeProxyTimeoutFeature.new
    else
      ProxmintFreeProxyBaseFeature.new
    end
  end
end
