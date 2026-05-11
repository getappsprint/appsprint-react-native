package com.appsprint

import com.appsprint.sdk.AppSprint
import com.appsprint.sdk.AppSprintConfig
import com.appsprint.sdk.AppSprintEventType
import com.appsprint.sdk.AttributionResult
import com.facebook.react.bridge.*
import kotlin.concurrent.thread

class AppSprintBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppSprintModule"

    @Volatile private var cachedSdk: AppSprint? = null

    private fun sdk(): AppSprint {
        cachedSdk?.let { return it }
        return synchronized(this) {
            cachedSdk ?: resolveSdk().also { cachedSdk = it }
        }
    }

    private fun resolveSdk(): AppSprint {
        val sdkClass = AppSprint::class.java

        runCatching {
            val shared = sdkClass.getMethod("shared", android.content.Context::class.java)
            return shared.invoke(null, reactApplicationContext) as AppSprint
        }

        val companion = sdkClass.getField("Companion").get(null)
        val shared = companion.javaClass.getMethod("shared", android.content.Context::class.java)
        return shared.invoke(companion, reactApplicationContext) as AppSprint
    }

    private fun runAsync(code: String, promise: Promise, block: () -> Unit) {
        thread(start = true) {
            try {
                block()
            } catch (t: Throwable) {
                promise.reject(code, t.message, t)
            }
        }
    }

    private fun resolveSync(code: String, promise: Promise, block: () -> Any?) {
        try {
            promise.resolve(block())
        } catch (t: Throwable) {
            promise.reject(code, t.message, t)
        }
    }

    // Core SDK

    @ReactMethod
    fun configure(config: ReadableMap, promise: Promise) {
        val apiKey = config.getString("apiKey")?.trim().orEmpty()
        if (apiKey.isEmpty()) {
            promise.reject("CONFIGURE_ERROR", "AppSprint.configure requires a non-empty apiKey.")
            return
        }

        runAsync("CONFIGURE_ERROR", promise) {
            val sdkConfig = AppSprintConfig(
                apiKey = apiKey,
                apiUrl = when {
                    config.hasKey("apiUrl") -> config.getString("apiUrl") ?: "https://api.appsprint.app"
                    config.hasKey("endpointBaseUrl") -> config.getString("endpointBaseUrl") ?: "https://api.appsprint.app"
                    else -> "https://api.appsprint.app"
                },
                enableAppleAdsAttribution = if (config.hasKey("enableAppleAdsAttribution")) config.getBoolean("enableAppleAdsAttribution") else true,
                isDebug = if (config.hasKey("isDebug")) config.getBoolean("isDebug") else false,
                logLevel = if (config.hasKey("logLevel")) config.getInt("logLevel") else if (config.hasKey("isDebug") && config.getBoolean("isDebug")) 0 else 2,
                customerUserId = if (config.hasKey("customerUserId")) config.getString("customerUserId") else null,
                autoTrackSessions = if (config.hasKey("autoTrackSessions")) config.getBoolean("autoTrackSessions") else true,
                autoRefreshAttribution = if (config.hasKey("autoRefreshAttribution")) config.getBoolean("autoRefreshAttribution") else true,
            )
            sdk().configure(sdkConfig)
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun sendEvent(eventType: String, name: String?, revenue: Double?, currency: String?, parameters: ReadableMap?, promise: Promise) {
        runAsync("SEND_EVENT_ERROR", promise) {
            val type = AppSprintEventType.entries.find { it.wireValue == eventType } ?: AppSprintEventType.CUSTOM
            val params = mutableMapOf<String, Any?>()
            parameters?.toHashMap()?.forEach { (key, value) -> params[key] = value }
            if (revenue != null) params["revenue"] = revenue
            if (currency != null) params["currency"] = currency
            sdk().sendEvent(type, name, if (params.isNotEmpty()) params else null)
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun sendTestEvent(promise: Promise) {
        runAsync("TEST_EVENT_ERROR", promise) {
            val result = sdk().sendTestEvent()
            val map = Arguments.createMap()
            map.putBoolean("success", result.success)
            map.putString("message", result.message)
            promise.resolve(map)
        }
    }

    @ReactMethod
    fun flush(promise: Promise) {
        runAsync("FLUSH_ERROR", promise) {
            sdk().flush()
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun clearData(promise: Promise) {
        runAsync("CLEAR_DATA_ERROR", promise) {
            sdk().clearData()
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun setCustomerUserId(userId: String, promise: Promise) {
        runAsync("SET_USER_ID_ERROR", promise) {
            sdk().setCustomerUserId(userId)
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun refreshAttribution(promise: Promise) {
        runAsync("REFRESH_ATTRIBUTION_ERROR", promise) {
            promise.resolve(sdk().refreshAttribution()?.let { attributionToMap(it) })
        }
    }

    @ReactMethod
    fun enableAppleAdsAttribution(promise: Promise) {
        runAsync("APPLE_ADS_ERROR", promise) {
            promise.resolve(sdk().enableAppleAdsAttribution())
        }
    }

    @ReactMethod
    fun getAppSprintId(promise: Promise) {
        resolveSync("GET_APPSPRINT_ID_ERROR", promise) { sdk().getAppSprintId() }
    }

    @ReactMethod
    fun getAttribution(promise: Promise) {
        resolveSync("GET_ATTRIBUTION_ERROR", promise) {
            sdk().getAttribution()?.let { attributionToMap(it) }
        }
    }

    @ReactMethod
    fun getAttributionParams(promise: Promise) {
        resolveSync("GET_ATTRIBUTION_PARAMS_ERROR", promise) {
            val map = Arguments.createMap()
            sdk().getAttributionParams().forEach { (key, value) -> map.putString(key, value) }
            map
        }
    }

    private fun attributionToMap(attr: AttributionResult): WritableMap {
        val map = Arguments.createMap()
        map.putBoolean("isAttributed", attr.isAttributed)
        map.putString("source", attr.source)
        map.putDouble("confidence", attr.confidence)
        attr.matchType?.let { map.putString("matchType", it) }
        attr.campaignName?.let { map.putString("campaignName", it) }
        attr.link?.let {
            val link = Arguments.createMap()
            link.putString("id", it.id)
            link.putString("name", it.name)
            map.putMap("link", link)
        }
        attr.appleAds?.let {
            val appleAds = Arguments.createMap()
            appleAds.putString("campaignId", it.campaignId)
            it.adGroupId?.let { value -> appleAds.putString("adGroupId", value) }
            it.keywordId?.let { value -> appleAds.putString("keywordId", value) }
            it.countryOrRegion?.let { value -> appleAds.putString("countryOrRegion", value) }
            it.conversionType?.let { value -> appleAds.putString("conversionType", value) }
            map.putMap("appleAds", appleAds)
        }
        attr.utmSource?.let { map.putString("utmSource", it) }
        attr.utmMedium?.let { map.putString("utmMedium", it) }
        attr.utmCampaign?.let { map.putString("utmCampaign", it) }
        attr.utmContent?.let { map.putString("utmContent", it) }
        attr.utmTerm?.let { map.putString("utmTerm", it) }
        return map
    }

    @ReactMethod
    fun isInitialized(promise: Promise) {
        resolveSync("IS_INITIALIZED_ERROR", promise) { sdk().isInitialized() }
    }

    @ReactMethod
    fun isSdkDisabled(promise: Promise) {
        resolveSync("SDK_DISABLED_ERROR", promise) { sdk().isSdkDisabled() }
    }

    @ReactMethod
    fun destroy(promise: Promise) {
        runAsync("DESTROY_ERROR", promise) {
            sdk().destroy()
            promise.resolve(null)
        }
    }

    // Utility

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            val info = Arguments.createMap()
            info.putString("deviceModel", android.os.Build.MODEL)
            val metrics = reactApplicationContext.resources.displayMetrics
            info.putInt("screenWidth", metrics.widthPixels)
            info.putInt("screenHeight", metrics.heightPixels)
            info.putString("locale", java.util.Locale.getDefault().toLanguageTag())
            info.putString("timezone", java.util.TimeZone.getDefault().id)
            info.putString("osVersion", android.os.Build.VERSION.RELEASE)
            promise.resolve(info)
        } catch (e: Exception) {
            promise.reject("DEVICE_INFO_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getAdServicesToken(promise: Promise) {
        promise.resolve(null) // iOS only
    }

    @ReactMethod
    fun requestTrackingAuthorization(promise: Promise) {
        promise.resolve(false) // iOS only
    }
}
