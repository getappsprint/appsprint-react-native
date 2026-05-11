"use strict";

import { NativeAppSprint } from "./NativeAppSprint";
function normalizeEventType(eventType) {
  return eventType.toLowerCase().replace(/-/g, "_");
}
const STANDARD_EVENT_TYPES = new Set(["session_start", "login", "sign_up", "register", "purchase", "subscribe", "start_trial", "add_payment_info", "add_to_cart", "add_to_wishlist", "initiate_checkout", "view_content", "view_item", "search", "share", "tutorial_complete", "achieve_level", "level_start", "level_complete", "custom"]);
function numericValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function revenueValue(params) {
  return numericValue(params?.revenue) ?? numericValue(params?.price);
}
function normalizeConfig(configOrApiKey, options = {}) {
  const config = typeof configOrApiKey === "string" ? {
    ...options,
    apiKey: configOrApiKey
  } : configOrApiKey;
  const apiUrl = config.apiUrl ?? config.endpointBaseUrl;
  return apiUrl ? {
    ...config,
    apiUrl
  } : config;
}
class AppSprintSDK {
  async configure(configOrApiKey, options = {}) {
    const config = normalizeConfig(configOrApiKey, options);
    if (typeof config.apiKey !== "string" || config.apiKey.trim().length === 0) {
      throw new Error("AppSprint.configure requires a non-empty apiKey.");
    }
    return NativeAppSprint.configure(config);
  }
  async sendEvent(eventType, name, params) {
    const normalizedEventType = normalizeEventType(eventType);
    const nativeEventType = STANDARD_EVENT_TYPES.has(normalizedEventType) ? normalizedEventType : "custom";
    const nativeName = nativeEventType === "custom" && normalizedEventType !== "custom" ? name ?? normalizedEventType : name ?? null;
    return NativeAppSprint.sendEvent(nativeEventType, nativeName, revenueValue(params), params?.currency ?? null, params ?? null);
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
  async refreshAttribution() {
    return NativeAppSprint.refreshAttribution();
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