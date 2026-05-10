"use strict";

import { NativeAppSprint } from "./NativeAppSprint";
function normalizeEventType(eventType) {
  return eventType.toLowerCase().replace(/-/g, "_");
}
function revenueValue(params) {
  const value = params?.revenue ?? params?.price;
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
class AppSprintSDK {
  async configure(config) {
    if (typeof config.apiKey !== "string" || config.apiKey.trim().length === 0) {
      throw new Error("AppSprint.configure requires a non-empty apiKey.");
    }
    return NativeAppSprint.configure(config);
  }
  async sendEvent(eventType, name, params) {
    return NativeAppSprint.sendEvent(normalizeEventType(eventType), name ?? null, revenueValue(params), params?.currency ?? null, params ?? null);
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
    return NativeAppSprint.enableAppleAdsAttribution();
  }
  async getAppSprintId() {
    return NativeAppSprint.getAppSprintId();
  }
  async getAttribution() {
    return NativeAppSprint.getAttribution();
  }
  async getAttributionParams() {
    return NativeAppSprint.getAttributionParams();
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