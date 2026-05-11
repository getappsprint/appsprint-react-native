import type { ConfigPlugin } from "@expo/config-plugins";

export interface AppSprintExpoPluginProps {
  trackingDescription?: string;
  advertisingAttributionEndpoint?: string;
}

declare const withAppSprint: ConfigPlugin<AppSprintExpoPluginProps | void>;

export default withAppSprint;
