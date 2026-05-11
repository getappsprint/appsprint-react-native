# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
