import { NativeModules, Platform } from "react-native";
import type { NativeAppSprintModule } from "./types";

const LINKING_ERROR =
  "The package 'appsprint-react-native' doesn't seem to be linked. " +
  "Make sure you have run 'pod install' and rebuilt the app.";

const unsupportedPlatformModule: NativeAppSprintModule = {
  async configure() {},
  async sendEvent() {},
  async sendTestEvent() {
    return { success: false, message: "Unsupported platform" };
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
  },
};

const NativeAppSprint: NativeAppSprintModule =
  Platform.OS === "ios" || Platform.OS === "android"
    ? NativeModules.AppSprintModule ??
      new Proxy({} as NativeAppSprintModule, {
        get() {
          throw new Error(LINKING_ERROR);
        },
      })
    : unsupportedPlatformModule;

export { NativeAppSprint };
