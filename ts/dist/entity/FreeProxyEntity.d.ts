import { ProxmintFreeProxyEntityBase } from '../ProxmintFreeProxyEntityBase';
import type { ProxmintFreeProxySDK } from '../ProxmintFreeProxySDK';
import type { Control } from '../types';
import type { FreeProxy, FreeProxyListMatch } from '../ProxmintFreeProxyTypes';
declare class FreeProxyEntity extends ProxmintFreeProxyEntityBase<FreeProxy> {
    constructor(client: ProxmintFreeProxySDK, entopts: any);
    make(this: FreeProxyEntity): FreeProxyEntity;
    list(this: any, reqmatch?: FreeProxyListMatch, ctrl?: Control): Promise<FreeProxyEntity[]>;
}
export { FreeProxyEntity };
