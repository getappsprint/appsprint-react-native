import Foundation
import React
import AppSprintSDK

@objc(AppSprintModule)
class AppSprintBridge: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool { return false }

  // MARK: - Core SDK

  @objc func configure(_ config: NSDictionary,
                       resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    let apiKey = (config["apiKey"] as? String)?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    guard !apiKey.isEmpty else {
      reject("CONFIGURE_ERROR", "AppSprint.configure requires a non-empty apiKey.", nil)
      return
    }

    Task { @MainActor in
      let apiUrl = config["apiUrl"] as? String
      let enableAppleAds = config["enableAppleAdsAttribution"] as? Bool ?? true
      let isDebug = config["isDebug"] as? Bool ?? false
      let logLevelRaw = config["logLevel"] as? Int
      let customerUserId = config["customerUserId"] as? String

      let logLevel: AppSprintLogLevel
      if let raw = logLevelRaw, let level = AppSprintLogLevel(rawValue: raw) {
        logLevel = level
      } else {
        logLevel = isDebug ? .debug : .warn
      }

      var sdkConfig = AppSprintConfig(
        apiKey: apiKey,
        enableAppleAdsAttribution: enableAppleAds,
        isDebug: isDebug,
        logLevel: logLevel,
        customerUserId: customerUserId
      )

      if let urlString = apiUrl, let url = URL(string: urlString) {
        sdkConfig = AppSprintConfig(
          apiKey: apiKey,
          apiURL: url,
          enableAppleAdsAttribution: enableAppleAds,
          isDebug: isDebug,
          logLevel: logLevel,
          customerUserId: customerUserId
        )
      }

      await AppSprint.shared.configure(sdkConfig)
      resolve(nil)
    }
  }

  @objc func sendEvent(_ eventType: String,
                       name: String?,
                       revenue: NSNumber?,
                       currency: String?,
                       parameters: NSDictionary?,
                       resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      let type = AppSprintEventType(rawValue: eventType) ?? .custom

      var params: [String: Any]? = nil
      if let parameters = parameters as? [String: Any] {
        params = parameters
      }
      if let rev = revenue?.doubleValue {
        if params == nil { params = [:] }
        params?["revenue"] = rev
      }
      if let cur = currency {
        if params == nil { params = [:] }
        params?["currency"] = cur
      }

      await AppSprint.shared.sendEvent(type, name: name, params: params)
      resolve(nil)
    }
  }

  @objc func sendTestEvent(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      let result = await AppSprint.shared.sendTestEvent()
      resolve(["success": result.success, "message": result.message])
    }
  }

  @objc func flush(_ resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      await AppSprint.shared.flush()
      resolve(nil)
    }
  }

  @objc func clearData(_ resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      AppSprint.shared.clearData()
      resolve(nil)
    }
  }

  @objc func setCustomerUserId(_ userId: String,
                                resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      await AppSprint.shared.setCustomerUserId(userId)
      resolve(nil)
    }
  }

  @objc func enableAppleAdsAttribution(_ resolve: @escaping RCTPromiseResolveBlock,
                                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      AppSprint.shared.enableAppleAdsAttribution()
      resolve(nil)
    }
  }

  @objc func getAppSprintId(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      let id = AppSprint.shared.getAppSprintId()
      resolve(id as Any)
    }
  }

  @objc func getAttribution(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      guard let attr = AppSprint.shared.getAttribution() else {
        resolve(NSNull())
        return
      }
      var dict: [String: Any] = [
        "source": attr.source,
        "confidence": attr.confidence,
      ]
      if let campaignName = attr.campaignName { dict["campaignName"] = campaignName }
      if let utmSource = attr.utmSource { dict["utmSource"] = utmSource }
      if let utmMedium = attr.utmMedium { dict["utmMedium"] = utmMedium }
      if let utmCampaign = attr.utmCampaign { dict["utmCampaign"] = utmCampaign }
      resolve(dict)
    }
  }

  @objc func isInitialized(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      resolve(AppSprint.shared.isInitialized)
    }
  }

  @objc func isSdkDisabled(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      resolve(AppSprint.shared.isSdkDisabled())
    }
  }

  @objc func destroy(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      AppSprint.shared.destroy()
      resolve(nil)
    }
  }

  // MARK: - Utility (device info, ATT)

  @objc func getDeviceInfo(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      let info = AppSprintNative.getDeviceInfo()
      var dict: [String: Any] = [:]
      if let m = info.deviceModel { dict["deviceModel"] = m }
      if let w = info.screenWidth { dict["screenWidth"] = w }
      if let h = info.screenHeight { dict["screenHeight"] = h }
      if let l = info.locale { dict["locale"] = l }
      if let t = info.timezone { dict["timezone"] = t }
      if let o = info.osVersion { dict["osVersion"] = o }
      if let v = info.idfv { dict["idfv"] = v }
      if let a = info.idfa { dict["idfa"] = a }
      if let token = info.adServicesToken { dict["adServicesToken"] = token }
      resolve(dict)
    }
  }

  @objc func getAdServicesToken(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
    let token = AppSprintNative.getAdServicesToken()
    resolve(token as Any)
  }

  @objc func requestTrackingAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                                          rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      let authorized = await AppSprintNative.requestTrackingAuthorization()
      resolve(authorized)
    }
  }
}
