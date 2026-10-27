import { ProxmintFreeProxyEntityBase } from '../ProxmintFreeProxyEntityBase';
import type { ProxmintFreeProxySDK } from '../ProxmintFreeProxySDK';
import type { Control } from '../types';
import type { Account, AccountListMatch } from '../ProxmintFreeProxyTypes';
declare class AccountEntity extends ProxmintFreeProxyEntityBase<Account> {
    constructor(client: ProxmintFreeProxySDK, entopts: any);
    make(this: AccountEntity): AccountEntity;
    list(this: any, reqmatch?: AccountListMatch, ctrl?: Control): Promise<AccountEntity[]>;
}
export { AccountEntity };
