package com.novamarket.core.network

import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.engine.okhttp.OkHttp

actual fun httpClientEngine(): HttpClientEngine {
    return OkHttp.create {
        config {
            followRedirects(true)
            followSslRedirects(true)
        }
    }
}
