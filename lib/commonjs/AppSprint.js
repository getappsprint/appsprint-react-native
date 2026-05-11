"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppSprint = void 0;
var _NativeAppSprint = require("./NativeAppSprint");
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
    return _NativeAppSprint.NativeAppSprint.configure(config);
  }
  async sendEvent(eventType, name, params) {
    const normalizedEventType = normalizeEventType(eventType);
    const nativeEventType = STANDARD_EVENT_TYPES.has(normalizedEventType) ? normalizedEventType : "custom";
    const nativeName = nativeEventType === "custom" && normalizedEventType !== "custom" ? name ?? normalizedEventType : name ?? null;
    return _NativeAppSprint.NativeAppSprint.sendEvent(nativeEventType, nativeName, revenueValue(params), params?.currency ?? null, params ?? null);
  }
  async sendTestEvent() {
    return _NativeAppSprint.NativeAppSprint.sendTestEvent();
  }
  async flush() {
    await _NativeAppSprint.NativeAppSprint.flush();
  }
  async clearData() {
    await _NativeAppSprint.NativeAppSprint.clearData();
  }
  async setCustomerUserId(userId) {
    await _NativeAppSprint.NativeAppSprint.setCustomerUserId(userId);
  }
  async refreshAttribution() {
    return _NativeAppSprint.NativeAppSprint.refreshAttribution();
  }
  async enableAppleAdsAttribution() {
    return _NativeAppSprint.NativeAppSprint.enableAppleAdsAttribution();
  }
  async getAppSprintId() {
    return _NativeAppSprint.NativeAppSprint.getAppSprintId();
  }
  async getAttribution() {
    return _NativeAppSprint.NativeAppSprint.getAttribution();
  }
  async getAttributionParams() {
    return _NativeAppSprint.NativeAppSprint.getAttributionParams();
  }
  async isInitialized() {
    return _NativeAppSprint.NativeAppSprint.isInitialized();
  }
  async isSdkDisabled() {
    return _NativeAppSprint.NativeAppSprint.isSdkDisabled();
  }
  async destroy() {
    await _NativeAppSprint.NativeAppSprint.destroy();
  }
}
const AppSprint = exports.AppSprint = new AppSprintSDK();
//# sourceMappingURL=AppSprint.js.map