<?php
declare(strict_types=1);

// ProxmintFreeProxy SDK base feature

class ProxmintFreeProxyBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(ProxmintFreeProxyContext $ctx, array $options): void {}
    public function PostConstruct(ProxmintFreeProxyContext $ctx): void {}
    public function PostConstructEntity(ProxmintFreeProxyContext $ctx): void {}
    public function SetData(ProxmintFreeProxyContext $ctx): void {}
    public function GetData(ProxmintFreeProxyContext $ctx): void {}
    public function GetMatch(ProxmintFreeProxyContext $ctx): void {}
    public function SetMatch(ProxmintFreeProxyContext $ctx): void {}
    public function PrePoint(ProxmintFreeProxyContext $ctx): void {}
    public function PreSpec(ProxmintFreeProxyContext $ctx): void {}
    public function PreRequest(ProxmintFreeProxyContext $ctx): void {}
    public function PreResponse(ProxmintFreeProxyContext $ctx): void {}
    public function PreResult(ProxmintFreeProxyContext $ctx): void {}
    public function PreDone(ProxmintFreeProxyContext $ctx): void {}
    public function PreUnexpected(ProxmintFreeProxyContext $ctx): void {}
}
