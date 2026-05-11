import { NativeAppSprint } from "./NativeAppSprint";
import type {
  AppSprintConfig,
  AppSprintOptions,
  AttributionParams,
  AttributionResult,
  EventParams,
  EventType,
  TestEventResult,
} from "./types";

function normalizeEventType(eventType: EventType | string): string {
  return eventType.toLowerCase().replace(/-/g, "_");
}

const STANDARD_EVENT_TYPES = new Set([
  "session_start",
  "login",
  "sign_up",
  "register",
  "purchase",
  "subscribe",
  "start_trial",
  "add_payment_info",
  "add_to_cart",
  "add_to_wishlist",
  "initiate_checkout",
  "view_content",
  "view_item",
  "search",
  "share",
  "tutorial_complete",
  "achieve_level",
  "level_start",
  "level_complete",
  "custom",
]);

function numericValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function revenueValue(params?: EventParams): number | null {
  return numericValue(params?.revenue) ?? numericValue(params?.price);
}

function normalizeConfig(
  configOrApiKey: AppSprintConfig | string,
  options: AppSprintOptions = {}
): AppSprintConfig {
  const config =
    typeof configOrApiKey === "string"
      ? { ...options, apiKey: configOrApiKey }
      : configOrApiKey;
  const apiUrl = config.apiUrl ?? config.endpointBaseUrl;
  return apiUrl ? { ...config, apiUrl } : config;
}

class AppSprintSDK {
  async configure(
    configOrApiKey: AppSprintConfig | string,
    options: AppSprintOptions = {}
  ): Promise<boolean> {
    const config = normalizeConfig(configOrApiKey, options);
    if (typeof config.apiKey !== "string" || config.apiKey.trim().length === 0) {
      throw new Error("AppSprint.configure requires a non-empty apiKey.");
    }

    return NativeAppSprint.configure(config as unknown as Record<string, unknown>);
  }

  async sendEvent(
    eventType: EventType | string,
    name?: string | null,
    params?: EventParams
  ): Promise<boolean> {
    const normalizedEventType = normalizeEventType(eventType);
    const nativeEventType = STANDARD_EVENT_TYPES.has(normalizedEventType)
      ? normalizedEventType
      : "custom";
    const nativeName =
      nativeEventType === "custom" && normalizedEventType !== "custom"
        ? name ?? normalizedEventType
        : name ?? null;

    return NativeAppSprint.sendEvent(
      nativeEventType,
      nativeName,
      revenueValue(params),
      params?.currency ?? null,
      params ?? null
    );
  }

  async sendTestEvent(): Promise<TestEventResult> {
    return NativeAppSprint.sendTestEvent();
  }

  async flush(): Promise<void> {
    await NativeAppSprint.flush();
  }

  async clearData(): Promise<void> {
    await NativeAppSprint.clearData();
  }

  async setCustomerUserId(userId: string): Promise<void> {
    await NativeAppSprint.setCustomerUserId(userId);
  }

  async refreshAttribution(): Promise<AttributionResult | null> {
    return NativeAppSprint.refreshAttribution();
  }

  async enableAppleAdsAttribution(): Promise<boolean> {
    return NativeAppSprint.enableAppleAdsAttribution();
  }

  async getAppSprintId(): Promise<string | null> {
    return NativeAppSprint.getAppSprintId();
  }

  async getAttribution(): Promise<AttributionResult | null> {
    return NativeAppSprint.getAttribution();
  }

  async getAttributionParams(): Promise<AttributionParams> {
    return NativeAppSprint.getAttributionParams();
  }

  async isInitialized(): Promise<boolean> {
    return NativeAppSprint.isInitialized();
  }

  async isSdkDisabled(): Promise<boolean> {
    return NativeAppSprint.isSdkDisabled();
  }

  async destroy(): Promise<void> {
    await NativeAppSprint.destroy();
  }
}

export const AppSprint = new AppSprintSDK();
