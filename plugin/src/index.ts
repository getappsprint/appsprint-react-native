import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";

const withAppSprint: ConfigPlugin<{
  trackingDescription?: string;
  advertisingAttributionEndpoint?: string;
} | void> = (config, props) => {
  const description =
    props?.trackingDescription ??
    "This identifier will be used to deliver personalized ads to you.";

  config = withInfoPlist(config, (config) => {
    // Add ATT usage description
    config.modResults.NSUserTrackingUsageDescription = description;

    // Add advertising attribution report endpoint
    if (props?.advertisingAttributionEndpoint) {
      config.modResults.NSAdvertisingAttributionReportEndpoint =
        props.advertisingAttributionEndpoint;
    }

    return config;
  });

  return config;
};

export default withAppSprint;
