import type { AttributionParams, AttributionResult } from "./types";
export interface AppSprintAppleAdsConfig {
    apiKey: string;
    apiUrl?: string;
    isDebug?: boolean;
}
declare class AppSprintAppleAdsSDK {
    configure(config: AppSprintAppleAdsConfig): Promise<boolean>;
    getAppSprintId(): Promise<string | null>;
    getAttributionParams(): Promise<AttributionParams>;
    getAttribution(): Promise<AttributionResult | null>;
    refreshAttribution(): Promise<AttributionResult | null>;
}
export declare const AppSprintAppleAds: AppSprintAppleAdsSDK;
export {};
//# sourceMappingURL=AppSprintAppleAds.d.ts.map