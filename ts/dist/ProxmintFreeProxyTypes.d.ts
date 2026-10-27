export interface Account {
    bandwidth: Record<string, any>;
    billing: string;
    id: string;
    name: string;
    product: string;
    proxy: Record<string, any>;
    status: string;
}
export interface AccountListMatch {
    bandwidth?: Record<string, any>;
    billing?: string;
    id?: string;
    name?: string;
    product?: string;
    proxy?: Record<string, any>;
    status?: string;
}
export interface FreeProxy {
    anonymity?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
    ip: string;
    lastCheckedAt?: string | null;
    latencyMs?: number | null;
    port: number;
    protocol: string;
    score: number;
    uptimePct: number;
}
export interface FreeProxyListMatch {
    anonymity?: string;
    country?: string;
    format?: string;
    page?: number;
    page_size?: number;
    protocol?: string;
    sort?: string;
}
export interface GeoIp {
    accuracyRadiusKm?: number | null;
    asn?: number | null;
    asnOrg?: string | null;
    city?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
    ip: string;
    lat?: number | null;
    lon?: number | null;
    region?: string | null;
    tz?: string | null;
}
export interface GeoIpLoadMatch {
    ip?: string;
}
export interface Usage {
    bytes: number;
    day: string;
    product: string;
    productId: string;
    requests: number;
}
export interface UsageListMatch {
    day?: number;
}
