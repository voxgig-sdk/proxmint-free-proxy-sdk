import { ProxmintFreeProxyEntityBase } from '../ProxmintFreeProxyEntityBase';
import type { ProxmintFreeProxySDK } from '../ProxmintFreeProxySDK';
import type { Control } from '../types';
import type { GeoIp, GeoIpLoadMatch } from '../ProxmintFreeProxyTypes';
declare class GeoIpEntity extends ProxmintFreeProxyEntityBase<GeoIp> {
    constructor(client: ProxmintFreeProxySDK, entopts: any);
    make(this: GeoIpEntity): GeoIpEntity;
    load(this: any, reqmatch?: GeoIpLoadMatch, ctrl?: Control): Promise<GeoIpEntity>;
}
export { GeoIpEntity };
