<?php
declare(strict_types=1);

// ProxmintFreeProxy SDK utility: feature_hook

class ProxmintFreeProxyFeatureHook
{
    public static function call(ProxmintFreeProxyContext $ctx, string $name): void
    {
        if (!$ctx->client) {
            return;
        }
        $features = $ctx->client->features ?? null;
        if (!$features) {
            return;
        }
        foreach ($features as $f) {
            if (method_exists($f, $name)) {
                $f->$name($ctx);
            }
        }
    }
}
