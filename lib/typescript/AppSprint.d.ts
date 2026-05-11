import type { AppSprintConfig, AppSprintOptions, AttributionParams, AttributionResult, EventParams, EventType, TestEventResult } from "./types";
declare class AppSprintSDK {
    configure(configOrApiKey: AppSprintConfig | string, options?: AppSprintOptions): Promise<boolean>;
    sendEvent(eventType: EventType | string, name?: string | null, params?: EventParams): Promise<boolean>;
    sendTestEvent(): Promise<TestEventResult>;
    flush(): Promise<void>;
    clearData(): Promise<void>;
    setCustomerUserId(userId: string): Promise<void>;
    refreshAttribution(): Promise<AttributionResult | null>;
    enableAppleAdsAttribution(): Promise<boolean>;
    getAppSprintId(): Promise<string | null>;
    getAttribution(): Promise<AttributionResult | null>;
    getAttributionParams(): Promise<AttributionParams>;
    isInitialized(): Promise<boolean>;
    isSdkDisabled(): Promise<boolean>;
    destroy(): Promise<void>;
}
export declare const AppSprint: AppSprintSDK;
export {};
//# sourceMappingURL=AppSprint.d.ts.map