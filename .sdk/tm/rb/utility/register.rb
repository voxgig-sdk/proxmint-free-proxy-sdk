# ProxmintFreeProxy SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

ProxmintFreeProxyUtility.registrar = ->(u) {
  u.clean = ProxmintFreeProxyUtilities::Clean
  u.clean_add = ProxmintFreeProxyUtilities::CleanAdd
  u.clean_explain = ProxmintFreeProxyUtilities::CleanExplain
  u.done = ProxmintFreeProxyUtilities::Done
  u.make_error = ProxmintFreeProxyUtilities::MakeError
  u.feature_add = ProxmintFreeProxyUtilities::FeatureAdd
  u.feature_hook = ProxmintFreeProxyUtilities::FeatureHook
  u.feature_init = ProxmintFreeProxyUtilities::FeatureInit
  u.fetcher = ProxmintFreeProxyUtilities::Fetcher
  u.make_fetch_def = ProxmintFreeProxyUtilities::MakeFetchDef
  u.make_context = ProxmintFreeProxyUtilities::MakeContext
  u.make_options = ProxmintFreeProxyUtilities::MakeOptions
  u.make_request = ProxmintFreeProxyUtilities::MakeRequest
  u.make_response = ProxmintFreeProxyUtilities::MakeResponse
  u.make_result = ProxmintFreeProxyUtilities::MakeResult
  u.make_point = ProxmintFreeProxyUtilities::MakePoint
  u.make_spec = ProxmintFreeProxyUtilities::MakeSpec
  u.make_url = ProxmintFreeProxyUtilities::MakeUrl
  u.param = ProxmintFreeProxyUtilities::Param
  u.prepare_auth = ProxmintFreeProxyUtilities::PrepareAuth
  u.prepare_body = ProxmintFreeProxyUtilities::PrepareBody
  u.prepare_headers = ProxmintFreeProxyUtilities::PrepareHeaders
  u.prepare_method = ProxmintFreeProxyUtilities::PrepareMethod
  u.prepare_params = ProxmintFreeProxyUtilities::PrepareParams
  u.prepare_path = ProxmintFreeProxyUtilities::PreparePath
  u.prepare_query = ProxmintFreeProxyUtilities::PrepareQuery
  u.graphql_body = ProxmintFreeProxyUtilities::GraphqlBody
  u.graphql_errors = ProxmintFreeProxyUtilities::GraphqlErrors
  u.result_basic = ProxmintFreeProxyUtilities::ResultBasic
  u.result_body = ProxmintFreeProxyUtilities::ResultBody
  u.result_headers = ProxmintFreeProxyUtilities::ResultHeaders
  u.transform_request = ProxmintFreeProxyUtilities::TransformRequest
  u.transform_response = ProxmintFreeProxyUtilities::TransformResponse
}
