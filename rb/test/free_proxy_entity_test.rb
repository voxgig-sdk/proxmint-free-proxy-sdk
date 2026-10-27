# FreeProxy entity test

require "minitest/autorun"
require "json"
require_relative "../ProxmintFreeProxy_sdk"
require_relative "runner"

class FreeProxyEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = ProxmintFreeProxySDK.test(nil, nil)
    ent = testsdk.FreeProxy(nil)
    assert !ent.nil?
  end

  def test_list_entities
    seed = {
      "entity" => {
        "free_proxy" => {
          "l1" => { "id" => "l1" },
          "l2" => { "id" => "l2" },
        },
      },
    }
    items = ProxmintFreeProxySDK.test(seed, nil).FreeProxy(nil).list(nil, nil)
    # list resolves to one entity per record; data_get reads the record.
    assert_equal 2, items.length
    items.each do |item|
      assert item.respond_to?(:data_get)
      assert item.data_get.is_a?(Hash)
    end
  end

  # Feature #4: the entity stream(action, ...) method runs the op pipeline and
  # returns an Enumerator over result items. With the streaming feature active
  # it yields the feature's incremental output; otherwise it falls back to the
  # materialised list so stream always yields.
  def test_stream
    seed = {
      "entity" => {
        "free_proxy" => {
          "s1" => { "id" => "s1" },
          "s2" => { "id" => "s2" },
          "s3" => { "id" => "s3" },
        },
      },
    }

    # Fallback: streaming inactive -> yields the materialised list items.
    base = ProxmintFreeProxySDK.test(seed, nil)
    seen = base.FreeProxy(nil).stream("list", nil, nil).to_a
    assert_equal 3, seen.length

    # Inbound: streaming active -> yields each item from the feature.
    cfg = ProxmintFreeProxyConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("streaming")
      sdk = ProxmintFreeProxySDK.test(seed, { "feature" => { "streaming" => { "active" => true } } })
      got = []
      sdk.FreeProxy(nil).stream("list", nil, nil).each do |item|
        if item.is_a?(Array)
          got.concat(item)
        else
          got << item
        end
      end
      assert_equal 3, got.length
    end
  end

  class FailHook < ProxmintFreeProxyBaseFeature
    attr_reader :unexpected

    def initialize
      super()
      @name = "failhook"
      @unexpected = 0
    end

    def PreSpec(ctx)
      raise "free_proxy hook failed"
    end

    def PreUnexpected(ctx)
      @unexpected += 1
    end
  end

  def test_stream_error
    offline = { "net" => { "offline" => true } }
    err = assert_raises(StandardError) do
      ProxmintFreeProxySDK.test(offline, nil).FreeProxy(nil).stream("list", nil, nil).to_a
    end
    assert_match(/offline/, err.message)

    ProxmintFreeProxySDK.test(offline, nil).FreeProxy(nil)
      .stream("list", nil, { "ctrl" => { "throw" => false } }).to_a

    cfg = ProxmintFreeProxyConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("rbac")
      denied = ProxmintFreeProxySDK.test(nil, { "feature" => { "rbac" => { "active" => true, "deny" => true } } })
      err = assert_raises(StandardError) do
        denied.FreeProxy(nil).stream("list", nil, nil).to_a
      end
      assert_equal "rbac_denied", err.code
    end
  end

  def test_stream_ctrl
    explain = {}
    ctrl = { "explain" => explain }
    ProxmintFreeProxySDK.test(nil, nil).FreeProxy(nil).stream("list", nil, { "ctrl" => ctrl }).to_a
    assert_equal ["explain"], ctrl.keys
    assert_same explain, ctrl["explain"]
    refute_empty explain
  end

  def test_unexpected
    hook = FailHook.new
    client = ProxmintFreeProxySDK.new({ "feature" => { "test" => { "active" => true } }, "extend" => [hook] })

    err = assert_raises(StandardError) do
      client.FreeProxy(nil).list(nil, nil)
    end
    assert_match(/hook failed/, err.message)
    assert_operator hook.unexpected, :>, 0

    fired = hook.unexpected
    assert_nil client.FreeProxy(nil).list(nil, { "throw" => false })
    assert_operator hook.unexpected, :>, fired
  end

  def test_validate_list_response
    cfg = ProxmintFreeProxyConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    opts = { "feature" => { "validate" => { "active" => true, "request" => false, "response" => true } } }
    listed = ProxmintFreeProxySDK.test({ "entity" => { "free_proxy" => { "v1" => { "ip" => "x", "port" => 1, "protocol" => "x", "score" => 1, "uptimePct" => 1 } } } }, opts).FreeProxy(nil).list(nil, nil)
    assert_equal ["v1"], listed.map { |ent| ent.data_get["id"] }
    err = assert_raises(StandardError) do
      ProxmintFreeProxySDK.test({ "entity" => { "free_proxy" => { "v1" => { "ip" => 1, "port" => 1, "protocol" => "x", "score" => 1, "uptimePct" => 1 } } } }, opts).FreeProxy(nil).list(nil, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_validate
    cfg = ProxmintFreeProxyConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = ProxmintFreeProxySDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.FreeProxy(nil).list({ "anonymity" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = free_proxy_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["list"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "free_proxy." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    free_proxy_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.free_proxy")))
    free_proxy_ref01_data = nil
    if free_proxy_ref01_data_raw.length > 0
      free_proxy_ref01_data = Helpers.to_map(free_proxy_ref01_data_raw[0][1])
    end

    # LIST
    free_proxy_ref01_ent = client.FreeProxy(nil)
    free_proxy_ref01_match = {}

    free_proxy_ref01_list_result = free_proxy_ref01_ent.list(free_proxy_ref01_match, nil)
    assert free_proxy_ref01_list_result.is_a?(Array)

  end
end

def free_proxy_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "free_proxy", "FreeProxyTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = ProxmintFreeProxySDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["free_proxy01", "free_proxy02", "free_proxy03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID" => idmap,
    "PROXMINT_FREE_PROXY_TEST_LIVE" => "FALSE",
    "PROXMINT_FREE_PROXY_TEST_EXPLAIN" => "FALSE",
    "PROXMINT_FREE_PROXY_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["PROXMINT_FREE_PROXY_TEST_FREE_PROXY_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["PROXMINT_FREE_PROXY_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["PROXMINT_FREE_PROXY_APIKEY"],
      },
      extra || {},
    ])
    client = ProxmintFreeProxySDK.new(Helpers.to_map(merged_opts))
  end

  live = env["PROXMINT_FREE_PROXY_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["PROXMINT_FREE_PROXY_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
