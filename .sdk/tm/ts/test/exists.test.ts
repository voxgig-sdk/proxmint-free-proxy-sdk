
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { ProxmintFreeProxySDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = ProxmintFreeProxySDK.test()
    equal(testsdk instanceof ProxmintFreeProxySDK, true,
      'ProxmintFreeProxySDK.test() must return a client synchronously')
  })

})
