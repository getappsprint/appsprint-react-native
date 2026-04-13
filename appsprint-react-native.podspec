require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "appsprint-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "14.0" }
  s.source       = { :git => package["repository"], :tag => "#{s.version}" }

  s.source_files = "ios/AppSprintBridge.{swift,m}"
  s.swift_version = "5.0"

  s.dependency "React-Core"

  s.ios.vendored_frameworks = "ios/AppSprintSDK.xcframework"
  s.frameworks = "AdServices", "AppTrackingTransparency", "AdSupport"
end
