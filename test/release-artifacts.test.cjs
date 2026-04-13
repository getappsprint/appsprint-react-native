"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const packageJson = require(path.join(projectRoot, "package.json"));

test("required binary artifacts are present", () => {
  const requiredPaths = [
    "android/libs/appsprint-sdk.aar",
    "ios/AppSprintSDK.xcframework/ios-arm64/AppSprintSDK.framework/AppSprintSDK",
    "ios/AppSprintSDK.xcframework/ios-arm64_x86_64-simulator/AppSprintSDK.framework/AppSprintSDK",
    "app.plugin.js",
    "plugin/build/index.js",
  ];

  for (const relativePath of requiredPaths) {
    assert.equal(
      fs.existsSync(path.join(projectRoot, relativePath)),
      true,
      `${relativePath} should exist`
    );
  }
});

test("package metadata reflects the binary-backed distribution contract", () => {
  assert.equal(packageJson["react-native"], "src/index.ts");
  assert.equal(packageJson.source, "src/index.ts");
  assert.equal(packageJson.files.includes("app.plugin.js"), true);
  assert.equal(packageJson.files.includes("src"), true);
  assert.equal(packageJson.files.includes("lib"), true);
  assert.equal(packageJson.files.includes("!lib/**/*.map"), true);
  assert.deepEqual(packageJson.expo?.plugins, ["./app.plugin.js"]);
});
