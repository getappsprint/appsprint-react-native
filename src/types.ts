export interface AppSprintConfig {
  apiKey: string;
  apiUrl?: string; // defaults to https://api.appsprint.app
  enableAppleAdsAttribution?: boolean;
  isDebug?: boolean;
  logLevel?: 0 | 1 | 2 | 3; // 0=DEBUG, 1=INFO, 2=WARN, 3=ERROR
  customerUserId?: string | null;
}

export type LogLevel = 0 | 1 | 2 | 3;

export type EventType =
  | "login"
  | "sign_up"
  | "register"
  | "purchase"
  | "subscribe"
  | "start_trial"
  | "add_to_cart"
  | "add_to_wishlist"
  | "initiate_checkout"
  | "view_content"
  | "view_item"
  | "search"
  | "share"
  | "tutorial_complete"
  | "level_start"
  | "level_complete"
  | "custom";

export interface EventParams {
  revenue?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface AttributionResult {
  source: "apple_ads" | "fingerprint" | "organic";
  confidence: number;
  campaignName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface InstallResponse {
  appsprintId: string;
  attribution: AttributionResult;
}

export interface TestEventResult {
  success: boolean;
  message: string;
}

export interface DeviceInfo {
  deviceModel?: string;
  screenWidth?: number;
  screenHeight?: number;
  locale?: string;
  timezone?: string;
  osVersion?: string;
  idfv?: string;
  idfa?: string;
  adServicesToken?: string;
}

export interface NativeAppSprintModule {
  // Core SDK (delegates to precompiled binary)
  configure(config: Record<string, unknown>): Promise<void>;
  sendEvent(
    eventType: string,
    name: string | null,
    revenue: number | null,
    currency: string | null,
    parameters: Record<string, unknown> | null
  ): Promise<void>;
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

  // Utility
  getDeviceInfo(): Promise<DeviceInfo>;
  getAdServicesToken(): Promise<string | null>;
  requestTrackingAuthorization(): Promise<boolean>;
}
