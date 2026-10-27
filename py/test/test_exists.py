# ProxmintFreeProxy SDK exists test

import pytest
from proxmintfreeproxy_sdk import ProxmintFreeProxySDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = ProxmintFreeProxySDK.test(None, None)
        assert testsdk is not None
