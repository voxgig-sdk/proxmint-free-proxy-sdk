# ProxmintFreeProxy SDK exists test

require "minitest/autorun"
require_relative "../ProxmintFreeProxy_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = ProxmintFreeProxySDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
