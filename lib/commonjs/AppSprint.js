"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppSprint = void 0;
var _NativeAppSprint = require("./NativeAppSprint");
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
    return _NativeAppSprint.NativeAppSprint.configure(config);
  }
  async sendEvent(eventType, name, params) {
    return _NativeAppSprint.NativeAppSprint.sendEvent(normalizeEventType(eventType), name ?? null, revenueValue(params), params?.currency ?? null, params ?? null);
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