"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

const requiredPaths = [
  "android/libs/appsprint-sdk.aar",
  "ios/AppSprintSDK.xcframework/ios-arm64/AppSprintSDK.framework/AppSprintSDK",
  "ios/AppSprintSDK.xcframework/ios-arm64/dSYMs/AppSprintSDK.framework.dSYM/Contents/Resources/DWARF/AppSprintSDK",
  "ios/AppSprintSDK.xcframework/ios-arm64_x86_64-simulator/AppSprintSDK.framework/AppSprintSDK",
  "ios/AppSprintSDK.xcframework/ios-arm64_x86_64-simulator/dSYMs/AppSprintSDK.framework.dSYM/Contents/Resources/DWARF/AppSprintSDK",
  "app.plugin.js",
  "plugin/build/index.js",
];

const missingPaths = requiredPaths.filter((relativePath) => {
  return !fs.existsSync(path.join(projectRoot, relativePath));
});

if (missingPaths.length > 0) {
  console.error("Missing required release artifacts:");
  for (const missingPath of missingPaths) {
    console.error(`- ${missingPath}`);
  }
  process.exit(1);
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "package.json"), "utf8")
);

const pluginEntries = packageJson.expo?.plugins ?? [];
if (!pluginEntries.includes("./app.plugin.js")) {
  console.error('package.json must register "./app.plugin.js" in expo.plugins.');
  process.exit(1);
}

const podspec = fs.readFileSync(
  path.join(projectRoot, "appsprint-react-native.podspec"),
  "utf8"
);

if (!podspec.includes(":git => repository_url")) {
  console.error("podspec must pass a string repository URL to CocoaPods :git.");
  process.exit(1);
}

if (!podspec.includes(':tag => "v#{s.version}"')) {
  console.error("podspec source tag must match v-prefixed GitHub release tags.");
  process.exit(1);
}

console.log("Release artifacts validated.");
