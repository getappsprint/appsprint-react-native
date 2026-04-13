import { NativeAppSprint } from "./NativeAppSprint";
import type {
  AppSprintConfig,
  AttributionResult,
  EventParams,
  EventType,
  TestEventResult,
} from "./types";

class AppSprintSDK {
  async configure(config: AppSprintConfig): Promise<void> {
    if (typeof config.apiKey !== "string" || config.apiKey.trim().length === 0) {
      throw new Error("AppSprint.configure requires a non-empty apiKey.");
    }

    await NativeAppSprint.configure(config as unknown as Record<string, unknown>);
  }

  async sendEvent(
    eventType: EventType,
    name?: string | null,
    params?: EventParams
  ): Promise<void> {
    await NativeAppSprint.sendEvent(
      eventType,
      name ?? null,
      params?.revenue ?? null,
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

  async enableAppleAdsAttribution(): Promise<void> {
    await NativeAppSprint.enableAppleAdsAttribution();
  }

  async getAppSprintId(): Promise<string | null> {
    return NativeAppSprint.getAppSprintId();
  }

  async getAttribution(): Promise<AttributionResult | null> {
    return NativeAppSprint.getAttribution();
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
