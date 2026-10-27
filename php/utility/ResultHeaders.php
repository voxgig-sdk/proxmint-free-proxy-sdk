<?php
declare(strict_types=1);

// ProxmintFreeProxy SDK utility: result_headers

class ProxmintFreeProxyResultHeaders
{
    public static function call(ProxmintFreeProxyContext $ctx): ?ProxmintFreeProxyResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
