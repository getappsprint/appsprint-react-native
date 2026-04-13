import type { AppSprintConfig, AttributionResult, EventParams, EventType, TestEventResult } from "./types";
declare class AppSprintSDK {
    configure(config: AppSprintConfig): Promise<void>;
    sendEvent(eventType: EventType, name?: string | null, params?: EventParams): Promise<void>;
    sendTestEvent(): Promise<TestEventResult>;
    flush(): Promise<void>;
    clearData(): Promise<void>;
    setCustomerUserId(userId: string): Promise<void>;
    enableAppleAdsAttribution(): Promise<void>;
    getAppSprintId(): Promise<string | null>;
    getAttribution(): Promise<AttributionResult | null>;
    isInitialized(): Promise<boolean>;
    isSdkDisabled(): Promise<boolean>;
    destroy(): Promise<void>;
}
export declare const AppSprint: AppSprintSDK;
export {};
//# sourceMappingURL=AppSprint.d.ts.map