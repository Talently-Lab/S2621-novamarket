package com.novamarket.core.di

import com.novamarket.core.network.createHttpClient
import com.novamarket.core.network.httpClientEngine
import com.novamarket.feature.authentication.di.auth
import io.ktor.client.HttpClient
import org.koin.core.KoinApplication
import org.koin.core.context.startKoin
import org.koin.dsl.module

fun initKoin(config: (KoinApplication.() -> Unit)? = null) {
    startKoin {
        config?.invoke(this)
        modules(network, auth)
    }
}
val network = module {
    single<HttpClient> { createHttpClient(httpClientEngine()) }
}
