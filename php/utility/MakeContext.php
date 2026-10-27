<?php
declare(strict_types=1);

// ProxmintFreeProxy SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class ProxmintFreeProxyMakeContext
{
    public static function call(array $ctxmap, ?ProxmintFreeProxyContext $basectx): ProxmintFreeProxyContext
    {
        return new ProxmintFreeProxyContext($ctxmap, $basectx);
    }
}
