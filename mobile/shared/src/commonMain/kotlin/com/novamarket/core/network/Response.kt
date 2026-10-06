package com.novamarket.core.network

sealed class Response<out t> {
    data class Success<T>(
        val data: T
    ) : Response<T>()

    data class Failed(
        val message: String,
        val exception: Throwable? = null
    ) : Response<Nothing>()
}
