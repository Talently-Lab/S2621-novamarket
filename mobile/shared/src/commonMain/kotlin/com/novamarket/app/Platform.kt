package com.novamarket.app

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform