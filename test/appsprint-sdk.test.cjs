"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { createSdkTestContext } = require("./helpers/load-sdk.cjs");

test("exports the documented public API", async () => {
  const ctx = createSdkTestContext();

  try {
    assert.ok(ctx.sdk.AppSprint);
    assert.ok(ctx.sdk.NativeAppSprint);
    assert.equal(typeof ctx.sdk.AppSprint.configure, "function");
    assert.equal(typeof ctx.sdk.AppSprint.sendEvent, "function");
    assert.equal(typeof ctx.sdk.AppSprint.sendTestEvent, "function");
    assert.equal(typeof ctx.sdk.AppSprint.flush, "function");
    assert.equal(typeof ctx.sdk.AppSprint.clearData, "function");
    assert.equal(typeof ctx.sdk.AppSprint.setCustomerUserId, "function");
    assert.equal(typeof ctx.sdk.AppSprint.refreshAttribution, "function");
    assert.equal(typeof ctx.sdk.AppSprint.getAppSprintId, "function");
    assert.equal(typeof ctx.sdk.AppSprint.getAttribution, "function");
    assert.equal(typeof ctx.sdk.AppSprint.getAttributionParams, "function");
    assert.equal(typeof ctx.sdk.AppSprint.isInitialized, "function");
    assert.equal(typeof ctx.sdk.AppSprint.isSdkDisabled, "function");
    assert.equal(typeof ctx.sdk.AppSprint.destroy, "function");
    assert.equal(typeof ctx.sdk.NativeAppSprint.getDeviceInfo, "function");
    assert.equal(typeof ctx.sdk.NativeAppSprint.requestTrackingAuthorization, "function");
    assert.equal("storageSet" in ctx.sdk.NativeAppSprint, false);
    assert.equal("storageGet" in ctx.sdk.NativeAppSprint, false);
    assert.equal("storageRemove" in ctx.sdk.NativeAppSprint, false);
  } finally {
    ctx.restore();
  }
});

test("configure delegates to native module", async () => {
  const ctx = createSdkTestContext();

  try {
    const configured = await ctx.sdk.AppSprint.configure({ apiKey: "test-key", isDebug: true });

    const configCall = ctx.calls.find((c) => c.method === "configure");
    assert.ok(configCall, "configure was called on native module");
    assert.equal(configured, true);
    assert.equal(configCall.args[0].apiKey, "test-key");
    assert.equal(configCall.args[0].isDebug, true);
    assert.equal(configCall.args[0].autoTrackSessions, undefined);
    assert.equal(configCall.args[0].autoRefreshAttribution, undefined);
  } finally {
    ctx.restore();
  }
});

test("configure accepts Appstack-style apiKey and options", async () => {
  const ctx = createSdkTestContext();

  try {
    const configured = await ctx.sdk.AppSprint.configure("test-key", {
      endpointBaseUrl: "https://edge.example.com",
      isDebug: true,
      autoTrackSessions: false,
      autoRefreshAttribution: false,
    });

    const configCall = ctx.calls.find((c) => c.method === "configure");
    assert.ok(configCall, "configure was called on native module");
    assert.equal(configured, true);
    assert.equal(configCall.args[0].apiKey, "test-key");
    assert.equal(configCall.args[0].apiUrl, "https://edge.example.com");
    assert.equal(configCall.args[0].isDebug, true);
    assert.equal(configCall.args[0].autoTrackSessions, false);
    assert.equal(configCall.args[0].autoRefreshAttribution, false);
  } finally {
    ctx.restore();
  }
});

test("sendEvent delegates with correct parameters", async () => {
  const ctx = createSdkTestContext();

  try {
    const sent = await ctx.sdk.AppSprint.sendEvent("PURCHASE", "test_purchase", {
      revenue: 4.99,
      currency: "USD",
      source: "test",
    });

    const sendCall = ctx.calls.find((c) => c.method === "sendEvent");
    assert.ok(sendCall, "sendEvent was called on native module");
    assert.equal(sendCall.args[0], "purchase");
    assert.equal(sent, true);
    assert.equal(sendCall.args[1], "test_purchase");
    assert.equal(sendCall.args[2], 4.99);
    assert.equal(sendCall.args[3], "USD");
    assert.deepEqual(sendCall.args[4], {
      revenue: 4.99,
      currency: "USD",
      source: "test",
    });
  } finally {
    ctx.restore();
  }
});

test("sendEvent accepts price as revenue fallback", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.sendEvent("purchase", "checkout", {
      price: "5.50",
      currency: "EUR",
    });

    const sendCall = ctx.calls.find((c) => c.method === "sendEvent");
    assert.ok(sendCall);
    assert.equal(sendCall.args[2], 5.5);
    assert.deepEqual(sendCall.args[4], { price: "5.50", currency: "EUR" });
  } finally {
    ctx.restore();
  }
});

test("sendEvent supports Appstack parity event names", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.sendEvent("ADD_PAYMENT_INFO");
    await ctx.sdk.AppSprint.sendEvent("achieve-level");

    const sendCalls = ctx.calls.filter((c) => c.method === "sendEvent");
    assert.equal(sendCalls[0].args[0], "add_payment_info");
    assert.equal(sendCalls[1].args[0], "achieve_level");
  } finally {
    ctx.restore();
  }
});

test("sendEvent preserves zero revenue", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.sendEvent("purchase", "trial_start", {
      revenue: 0,
      currency: "USD",
    });

    const sendCall = ctx.calls.find((c) => c.method === "sendEvent");
    assert.ok(sendCall);
    assert.equal(sendCall.args[2], 0);
    assert.equal(sendCall.args[3], "USD");
  } finally {
    ctx.restore();
  }
});

test("sendEvent drops non-finite revenue before native bridge", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.sendEvent("purchase", "bad_number", {
      revenue: Number.NaN,
      currency: "USD",
    });
    await ctx.sdk.AppSprint.sendEvent("purchase", "bad_price", {
      price: Number.POSITIVE_INFINITY,
      currency: "USD",
    });

    const sendCalls = ctx.calls.filter((c) => c.method === "sendEvent");
    assert.equal(sendCalls.length, 2);
    assert.equal(sendCalls[0].args[2], null);
    assert.equal(sendCalls[1].args[2], null);
  } finally {
    ctx.restore();
  }
});

test("sendEvent falls back to price when revenue is non-finite", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.sendEvent("purchase", "checkout", {
      revenue: Number.NaN,
      price: "9.99",
      currency: "USD",
    });

    const sendCall = ctx.calls.find((c) => c.method === "sendEvent");
    assert.ok(sendCall);
    assert.equal(sendCall.args[2], 9.99);
  } finally {
    ctx.restore();
  }
});

test("sendEvent preserves unknown strings as custom event names", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.sendEvent("purcase");

    const sendCall = ctx.calls.find((c) => c.method === "sendEvent");
    assert.ok(sendCall);
    assert.equal(sendCall.args[0], "custom");
    assert.equal(sendCall.args[1], "purcase");
  } finally {
    ctx.restore();
  }
});

test("sendEvent handles null name and params", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.sendEvent("login");

    const sendCall = ctx.calls.find((c) => c.method === "sendEvent");
    assert.ok(sendCall);
    assert.equal(sendCall.args[0], "login");
    assert.equal(sendCall.args[1], null);
    assert.equal(sendCall.args[2], null);
    assert.equal(sendCall.args[3], null);
    assert.equal(sendCall.args[4], null);
  } finally {
    ctx.restore();
  }
});

test("getAppSprintId returns value from native module", async () => {
  const ctx = createSdkTestContext({
    resolvedValues: { getAppSprintId: "app_123" },
  });

  try {
    const id = await ctx.sdk.AppSprint.getAppSprintId();
    assert.equal(id, "app_123");
  } finally {
    ctx.restore();
  }
});

test("getAttribution returns value from native module", async () => {
  const attr = {
    isAttributed: true,
    source: "tracking_link",
    matchType: "ip_user_agent",
    link: { id: "link_123", name: "Spring Campaign" },
    utmSource: "newsletter",
  };
  const ctx = createSdkTestContext({
    resolvedValues: { getAttribution: attr },
  });

  try {
    const result = await ctx.sdk.AppSprint.getAttribution();
    assert.deepEqual(result, attr);
  } finally {
    ctx.restore();
  }
});

test("refreshAttribution returns updated native attribution", async () => {
  const attr = {
    isAttributed: true,
    source: "apple_ads",
    matchType: "apple_ads",
    appleAds: { campaignId: "123" },
  };
  const ctx = createSdkTestContext({
    resolvedValues: { refreshAttribution: attr },
  });

  try {
    const result = await ctx.sdk.AppSprint.refreshAttribution();
    const call = ctx.calls.find((c) => c.method === "refreshAttribution");
    assert.ok(call);
    assert.deepEqual(result, attr);
  } finally {
    ctx.restore();
  }
});

test("getAttributionParams returns partner payload from native module", async () => {
  const params = {
    appsprintId: "app_123",
    appstackId: "app_123",
    gclid: "gclid_123",
  };
  const ctx = createSdkTestContext({
    resolvedValues: { getAttributionParams: params },
  });

  try {
    const result = await ctx.sdk.AppSprint.getAttributionParams();
    assert.deepEqual(result, params);
  } finally {
    ctx.restore();
  }
});

test("sendTestEvent delegates to native module", async () => {
  const ctx = createSdkTestContext({
    resolvedValues: {
      sendTestEvent: { success: true, message: "Test event sent successfully." },
    },
  });

  try {
    const result = await ctx.sdk.AppSprint.sendTestEvent();
    assert.equal(result.success, true);
    assert.equal(result.message, "Test event sent successfully.");
  } finally {
    ctx.restore();
  }
});

test("flush delegates to native module", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.flush();
    const flushCall = ctx.calls.find((c) => c.method === "flush");
    assert.ok(flushCall, "flush was called on native module");
  } finally {
    ctx.restore();
  }
});

test("clearData delegates to native module", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.clearData();
    const clearCall = ctx.calls.find((c) => c.method === "clearData");
    assert.ok(clearCall, "clearData was called on native module");
  } finally {
    ctx.restore();
  }
});

test("setCustomerUserId delegates with userId", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.setCustomerUserId("user_456");
    const setCall = ctx.calls.find((c) => c.method === "setCustomerUserId");
    assert.ok(setCall);
    assert.equal(setCall.args[0], "user_456");
  } finally {
    ctx.restore();
  }
});

test("destroy delegates to native module and remains awaitable", async () => {
  const ctx = createSdkTestContext();

  try {
    await ctx.sdk.AppSprint.destroy();
    const destroyCall = ctx.calls.find((c) => c.method === "destroy");
    assert.ok(destroyCall, "destroy was called on native module");
  } finally {
    ctx.restore();
  }
});

test("configure rejects empty apiKey before calling native module", async () => {
  const ctx = createSdkTestContext();

  try {
    await assert.rejects(
      () => ctx.sdk.AppSprint.configure({ apiKey: "   " }),
      /non-empty apiKey/
    );
    const configCall = ctx.calls.find((c) => c.method === "configure");
    assert.equal(configCall, undefined);
  } finally {
    ctx.restore();
  }
});

test("unsupported platforms return the documented safe fallback behavior", async () => {
  const ctx = createSdkTestContext({ platform: "web" });

  try {
    assert.equal(await ctx.sdk.AppSprint.isInitialized(), false);
    assert.equal(await ctx.sdk.AppSprint.isSdkDisabled(), false);
    assert.equal(await ctx.sdk.NativeAppSprint.getAdServicesToken(), null);
    assert.equal(await ctx.sdk.NativeAppSprint.requestTrackingAuthorization(), false);
    assert.deepEqual(await ctx.sdk.NativeAppSprint.getDeviceInfo(), {});
    assert.deepEqual(await ctx.sdk.AppSprint.getAttributionParams(), {});
    await ctx.sdk.AppSprint.destroy();
  } finally {
    ctx.restore();
  }
});
