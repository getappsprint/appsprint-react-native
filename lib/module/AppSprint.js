"use strict";

import { NativeAppSprint } from "./NativeAppSprint";
class AppSprintSDK {
  async configure(config) {
    if (typeof config.apiKey !== "string" || config.apiKey.trim().length === 0) {
      throw new Error("AppSprint.configure requires a non-empty apiKey.");
    }
    await NativeAppSprint.configure(config);
  }
  async sendEvent(eventType, name, params) {
    await NativeAppSprint.sendEvent(eventType, name ?? null, params?.revenue ?? null, params?.currency ?? null, params ?? null);
  }
  async sendTestEvent() {
    return NativeAppSprint.sendTestEvent();
  }
  async flush() {
    await NativeAppSprint.flush();
  }
  async clearData() {
    await NativeAppSprint.clearData();
  }
  async setCustomerUserId(userId) {
    await NativeAppSprint.setCustomerUserId(userId);
  }
  async enableAppleAdsAttribution() {
    await NativeAppSprint.enableAppleAdsAttribution();
  }
  async getAppSprintId() {
    return NativeAppSprint.getAppSprintId();
  }
  async getAttribution() {
    return NativeAppSprint.getAttribution();
  }
  async isInitialized() {
    return NativeAppSprint.isInitialized();
  }
  async isSdkDisabled() {
    return NativeAppSprint.isSdkDisabled();
  }
  async destroy() {
    await NativeAppSprint.destroy();
  }
}
export const AppSprint = new AppSprintSDK();
//# sourceMappingURL=AppSprint.js.map