# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.1 - 2026-05-11

### Added
- Google Ads consent configuration and event payload parity.
- Full Apple Ads attribution fields exposed through the bridge.

### Fixed
- Updated vendored native binaries with iOS v1.0.1 and Android v1.0.2.
- Completed `getDeviceInfo()` parity for app version, GAID, IDFV/IDFA, AdServices token, and ATT status where platform-available.
- Replaced per-call Android bridge threads with a bounded bridge executor.
- Pointed temporary install instructions at the GitHub `v1.0.1` tag while npm publishing is blocked.

## 1.0.0 - 2026-05-11

### Added
- Updated vendored iOS and Android SDKs to 1.0.0.
- Added `autoTrackSessions` and `autoRefreshAttribution` configuration.
- Added `refreshAttribution()` for manual attribution refresh parity.

## 0.2.0 - 2026-04-13

### Added
- TypeScript bridge to native iOS and Android SDKs
- Full public API: configure, sendEvent, flush, getAttribution, etc.
- Expo config plugin for ATT permission
- Prepack validation for vendored binaries
- CI/CD workflows (typecheck, test)
- Vendored iOS XCFramework and Android AAR

## 0.1.0

### Added
- Initial SDK scaffold with React Native builder-bob
