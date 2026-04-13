# appsprint-react-native

AppSprint mobile attribution SDK for React Native. It tracks installs, attribution, lifecycle events, custom events, and revenue events, with local event queueing for transient failures.

## Installation

```bash
npm install appsprint-react-native
```

### iOS

```bash
cd ios && pod install
```

## Expo config plugin

If you use Expo prebuild, add the plugin to your app config:

```json
{
  "plugins": [
    [
      "appsprint-react-native",
      {
        "trackingDescription": "This identifier will be used to deliver personalized ads to you."
      }
    ]
  ]
}
```

Plugin options:

| Option | Type | Description | Default |
|---|---|---|---|
| `trackingDescription` | `string` | ATT permission dialog text for `NSUserTrackingUsageDescription` | `"This identifier will be used to deliver personalized ads to you."` |
| `advertisingAttributionEndpoint` | `string` | Sets `NSAdvertisingAttributionReportEndpoint` | — |

## Quick start

Initialize the SDK as early as possible in app startup:

```tsx
import { AppSprint } from "appsprint-react-native";

await AppSprint.configure({
  apiKey: "YOUR_API_KEY",
});
```

### Configuration

| Option | Type | Required | Default |
|---|---|---|---|
| `apiKey` | `string` | Yes | — |
| `apiUrl` | `string` | No | `https://api.appsprint.app` |
| `enableAppleAdsAttribution` | `boolean` | No | `true` |
| `isDebug` | `boolean` | No | `false` |
| `logLevel` | `0 \| 1 \| 2 \| 3` | No | `2` |
| `customerUserId` | `string \| null` | No | `null` |

Log levels:

`0 = debug`, `1 = info`, `2 = warn`, `3 = error`

## Sending events

```tsx
import { AppSprint } from "appsprint-react-native";

await AppSprint.sendEvent("login");
await AppSprint.sendEvent("sign_up");
await AppSprint.sendEvent("purchase", null, {
  revenue: 9.99,
  currency: "USD",
});

await AppSprint.sendEvent("custom", "onboarding_step", {
  screen: "welcome",
  step: 1,
});
```

Supported `eventType` values:

`login` | `sign_up` | `register` | `purchase` | `subscribe` | `start_trial` | `add_to_cart` | `add_to_wishlist` | `initiate_checkout` | `view_content` | `view_item` | `search` | `share` | `tutorial_complete` | `level_start` | `level_complete` | `custom`

Notes:

- Use `eventType: "custom"` together with the optional `name` argument for custom event names.
- Revenue fields are accepted through `params.revenue` and `params.currency`.
- If an event cannot be delivered, it is queued locally and retried on the next initialization or explicit flush.

## Public API

### `AppSprint`

```tsx
import { AppSprint } from "appsprint-react-native";
```

Available methods:

- `configure(config)` initializes the SDK and performs install tracking when needed.
- `sendEvent(eventType, name?, params?)` sends or queues an event.
- `sendTestEvent()` sends a diagnostic event and returns `{ success, message }`.
- `flush()` retries queued events immediately.
- `clearData()` clears cached SDK state and the local event queue.
- `isSdkDisabled()` returns whether the SDK has been disabled because the API key was rejected.
- `setCustomerUserId(userId)` updates the customer user id locally and remotely when possible.
- `getAppSprintId()` returns the cached AppSprint install identifier, if available.
- `getAttribution()` returns the last cached attribution result, if available.
- `enableAppleAdsAttribution()` re-enables Apple Ads attribution in the current runtime config.
- `isInitialized()` reports whether `configure()` completed.
- `destroy()` removes SDK listeners.

### `NativeAppSprint`

```tsx
import { NativeAppSprint } from "appsprint-react-native";
```

Available methods:

- `getDeviceInfo()`
- `getAdServicesToken()`
- `requestTrackingAuthorization()`

Example ATT request on iOS:

```tsx
import { NativeAppSprint } from "appsprint-react-native";

const authorized = await NativeAppSprint.requestTrackingAuthorization();
```

## Attribution

The SDK tracks install attribution once an install is registered. You can read the cached values at any time:

```tsx
const attribution = await AppSprint.getAttribution();
const appsprintId = await AppSprint.getAppSprintId();
```

`AttributionResult.source` can be:

`apple_ads` | `fingerprint` | `organic`

## Offline and retry behavior

- The SDK keeps up to `100` queued events in local storage.
- Queued events are flushed after `configure()` and when the app moves to the background.
- Failed flushes keep the unsent events queued for a later retry.
- A rejected API key (`401` or `403`) disables the SDK and drops future events until cached data is cleared.

## Local development

Point the SDK at a non-production backend during development:

```tsx
await AppSprint.configure({
  apiKey: "YOUR_API_KEY",
  apiUrl: "http://localhost:3000",
  isDebug: true,
});
```

## License

MIT
