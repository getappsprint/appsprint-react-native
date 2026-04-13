"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeAppSprint = void 0;
var _reactNative = require("react-native");
const LINKING_ERROR = "The package 'appsprint-react-native' doesn't seem to be linked. " + "Make sure you have run 'pod install' and rebuilt the app.";
const unsupportedPlatformModule = {
  async configure() {},
  async sendEvent() {},
  async sendTestEvent() {
    return {
      success: false,
      message: "Unsupported platform"
    };
  },
  async flush() {},
  async clearData() {},
  async setCustomerUserId() {},
  async enableAppleAdsAttribution() {},
  async getAppSprintId() {
    return null;
  },
  async getAttribution() {
    return null;
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
const NativeAppSprint = exports.NativeAppSprint = _reactNative.Platform.OS === "ios" || _reactNative.Platform.OS === "android" ? _reactNative.NativeModules.AppSprintModule ?? new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
}) : unsupportedPlatformModule;
//# sourceMappingURL=NativeAppSprint.js.map