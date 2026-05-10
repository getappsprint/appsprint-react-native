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
  | "session_start"
  | "SESSION_START"
  | "login"
  | "LOGIN"
  | "sign_up"
  | "SIGN_UP"
  | "register"
  | "REGISTER"
  | "purchase"
  | "PURCHASE"
  | "subscribe"
  | "SUBSCRIBE"
  | "start_trial"
  | "START_TRIAL"
  | "add_to_cart"
  | "ADD_TO_CART"
  | "add_to_wishlist"
  | "ADD_TO_WISHLIST"
  | "initiate_checkout"
  | "INITIATE_CHECKOUT"
  | "view_content"
  | "VIEW_CONTENT"
  | "view_item"
  | "VIEW_ITEM"
  | "search"
  | "SEARCH"
  | "share"
  | "SHARE"
  | "tutorial_complete"
  | "TUTORIAL_COMPLETE"
  | "level_start"
  | "LEVEL_START"
  | "level_complete"
  | "LEVEL_COMPLETE"
  | "custom"
  | "CUSTOM";

export interface EventParams {
  revenue?: number;
  price?: number | string;
  currency?: string;
  [key: string]: unknown;
}

export type AttributionParams = Record<string, string>;

export interface AttributionLink {
  id: string;
  name: string;
}

export interface AppleAdsAttribution {
  campaignId: string;
  adGroupId?: string | null;
  keywordId?: string | null;
  countryOrRegion?: string | null;
  conversionType?: string | null;
}

export interface AttributionResult {
  isAttributed?: boolean;
  source?: "tracking_link" | "apple_ads" | "organic" | "fingerprint" | string;
  matchType?: "idfa" | "idfv" | "ip_user_agent" | "apple_ads" | "organic" | string;
  link?: AttributionLink | null;
  appleAds?: AppleAdsAttribution | null;
  confidence?: number;
  campaignName?: string | null;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string | null;
  utmTerm?: string | null;
}

export interface InstallResponse {
  appsprintId: string;
  attribution: AttributionResult;
  attributionParams?: AttributionParams;
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
  appVersion?: string;
  gaid?: string;
  idfv?: string;
  idfa?: string;
  adServicesToken?: string;
  attStatus?: "not_determined" | "restricted" | "denied" | "authorized";
}

export interface NativeAppSprintModule {
  // Core SDK (delegates to precompiled binary)
  configure(config: Record<string, unknown>): Promise<boolean>;
  sendEvent(
    eventType: string,
    name: string | null,
    revenue: number | null,
    currency: string | null,
    parameters: Record<string, unknown> | null
  ): Promise<boolean>;
  sendTestEvent(): Promise<TestEventResult>;
  flush(): Promise<void>;
  clearData(): Promise<void>;
  setCustomerUserId(userId: string): Promise<void>;
  enableAppleAdsAttribution(): Promise<boolean>;
  getAppSprintId(): Promise<string | null>;
  getAttribution(): Promise<AttributionResult | null>;
  getAttributionParams(): Promise<AttributionParams>;
  isInitialized(): Promise<boolean>;
  isSdkDisabled(): Promise<boolean>;
  destroy(): Promise<void>;

  // Utility
  getDeviceInfo(): Promise<DeviceInfo>;
  getAdServicesToken(): Promise<string | null>;
  requestTrackingAuthorization(): Promise<boolean>;
}
