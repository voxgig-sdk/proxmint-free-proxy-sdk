<?php
declare(strict_types=1);

// ProxmintFreeProxy SDK exists test

require_once __DIR__ . '/../proxmintfreeproxy_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = ProxmintFreeProxySDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
