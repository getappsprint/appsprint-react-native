"use strict";

const { withInfoPlist } = require("@expo/config-plugins");

const DEFAULT_TRACKING_DESCRIPTION =
  "This identifier will be used to deliver personalized ads to you.";

const withAppSprint = (config, props) =>
  withInfoPlist(config, (expoConfig) => {
    expoConfig.modResults.NSUserTrackingUsageDescription =
      props?.trackingDescription ?? DEFAULT_TRACKING_DESCRIPTION;

    if (props?.advertisingAttributionEndpoint) {
      expoConfig.modResults.NSAdvertisingAttributionReportEndpoint =
        props.advertisingAttributionEndpoint;
    }

    return expoConfig;
  });

module.exports = withAppSprint;
module.exports.default = withAppSprint;
