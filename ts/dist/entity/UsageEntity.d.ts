import { ProxmintFreeProxyEntityBase } from '../ProxmintFreeProxyEntityBase';
import type { ProxmintFreeProxySDK } from '../ProxmintFreeProxySDK';
import type { Control } from '../types';
import type { Usage, UsageListMatch } from '../ProxmintFreeProxyTypes';
declare class UsageEntity extends ProxmintFreeProxyEntityBase<Usage> {
    constructor(client: ProxmintFreeProxySDK, entopts: any);
    make(this: UsageEntity): UsageEntity;
    list(this: any, reqmatch?: UsageListMatch, ctrl?: Control): Promise<UsageEntity[]>;
}
export { UsageEntity };
