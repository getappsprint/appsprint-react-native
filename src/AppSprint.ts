import { NativeAppSprint } from "./NativeAppSprint";
import type {
  AppSprintConfig,
  AttributionParams,
  AttributionResult,
  EventParams,
  EventType,
  TestEventResult,
} from "./types";

function normalizeEventType(eventType: EventType | string): string {
  return eventType.toLowerCase().replace(/-/g, "_");
}

function revenueValue(params?: EventParams): number | null {
  const value = params?.revenue ?? params?.price;
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

class AppSprintSDK {
  async configure(config: AppSprintConfig): Promise<boolean> {
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
    return NativeAppSprint.sendEvent(
      normalizeEventType(eventType),
      name ?? null,
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
