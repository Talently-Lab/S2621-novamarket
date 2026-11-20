package com.novamarket.navigation

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

@Serializable
sealed interface AppScreen : NavKey

@Serializable
data object Login : AppScreen

@Serializable
data object Register : AppScreen

@Serializable
data object Home : AppScreen

@Serializable
data object Admin : AppScreen

@Serializable
data object Cart : AppScreen

@Serializable
data object Checkout : AppScreen

@Serializable
data object NotFound : AppScreen

@Serializable
data object Products : AppScreen

@Serializable
data object ProductDetail : AppScreen
