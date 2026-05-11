"use strict";

import { NativeModules, Platform } from "react-native";
const LINKING_ERROR = "The package 'appsprint-react-native' doesn't seem to be linked. " + "Make sure you have run 'pod install' and rebuilt the app.";
const unsupportedPlatformModule = {
  async configure() {
    return false;
  },
  async sendEvent() {
    return false;
  },
  async sendTestEvent() {
    return {
      success: false,
      message: "Unsupported platform"
    };
  },
  async flush() {},
  async clearData() {},
  async setCustomerUserId() {},
  async refreshAttribution() {
    return null;
  },
  async enableAppleAdsAttribution() {
    return false;
  },
  async getAppSprintId() {
    return null;
  },
  async getAttribution() {
    return null;
  },
  async getAttributionParams() {
    return {};
  },
  async isInitialized() {
    return false;
  },
  async isSdkDisabled() {
    return false;
  },
  async destroy() {},
  async getDeviceInfo() {
    return {};
  },
  async getAdServicesToken() {
    return null;
  },
  async requestTrackingAuthorization() {
    return false;
  }
};
const NativeAppSprint = Platform.OS === "ios" || Platform.OS === "android" ? NativeModules.AppSprintModule ?? new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
}) : unsupportedPlatformModule;
export { NativeAppSprint };
//# sourceMappingURL=NativeAppSprint.js.map