import { AccountEntity } from './entity/AccountEntity';
import { FreeProxyEntity } from './entity/FreeProxyEntity';
import { GeoIpEntity } from './entity/GeoIpEntity';
import { UsageEntity } from './entity/UsageEntity';
export type * from './ProxmintFreeProxyTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { ProxmintFreeProxyEntityBase } from './ProxmintFreeProxyEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class ProxmintFreeProxySDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Account(entopts?: Record<string, any>): AccountEntity;
    FreeProxy(entopts?: Record<string, any>): FreeProxyEntity;
    GeoIp(entopts?: Record<string, any>): GeoIpEntity;
    Usage(entopts?: Record<string, any>): UsageEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): ProxmintFreeProxySDK;
    tester(testopts?: any, sdkopts?: any): ProxmintFreeProxySDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof ProxmintFreeProxySDK;
export { stdutil, config, BaseFeature, ProxmintFreeProxyEntityBase, ProxmintFreeProxySDK, SDK, };
export type { DirectResult };
