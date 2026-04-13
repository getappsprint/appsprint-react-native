"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppSprint = void 0;
var _NativeAppSprint = require("./NativeAppSprint");
class AppSprintSDK {
  async configure(config) {
    if (typeof config.apiKey !== "string" || config.apiKey.trim().length === 0) {
      throw new Error("AppSprint.configure requires a non-empty apiKey.");
    }
    await _NativeAppSprint.NativeAppSprint.configure(config);
  }
  async sendEvent(eventType, name, params) {
    await _NativeAppSprint.NativeAppSprint.sendEvent(eventType, name ?? null, params?.revenue ?? null, params?.currency ?? null, params ?? null);
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
    await _NativeAppSprint.NativeAppSprint.enableAppleAdsAttribution();
  }
  async getAppSprintId() {
    return _NativeAppSprint.NativeAppSprint.getAppSprintId();
  }
  async getAttribution() {
    return _NativeAppSprint.NativeAppSprint.getAttribution();
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