package com.novamarket.app

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation3.runtime.NavKey
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import androidx.savedstate.serialization.SavedStateConfiguration
import com.novamarket.feature.authentication.presentation.screen.LoginScreen
import com.novamarket.feature.authentication.presentation.screen.RegisterScreen
import com.novamarket.feature.home.presentation.screen.HomeScreen
import com.novamarket.navigation.Home
import com.novamarket.navigation.Login
import com.novamarket.navigation.ProductDetail
import com.novamarket.navigation.Products
import com.novamarket.navigation.Register
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic

private val navigationConfig = SavedStateConfiguration {
    serializersModule = SerializersModule {
        polymorphic(NavKey::class) {
            subclass(Home::class, Home.serializer())
            subclass(Login::class, Login.serializer())
            subclass(Register::class, Register.serializer())
            subclass(Products::class, Products.serializer())
            subclass(ProductDetail::class, ProductDetail.serializer())
        }
    }
}

@Composable
@Preview
fun App() {
    val backStack = rememberNavBackStack(navigationConfig, Home)
    MaterialTheme {
        NavDisplay(
            backStack = backStack,
            entryProvider = entryProvider {
                entry<Home> {
                    HomeScreen()
                }
                entry<Login> {
                    LoginScreen()
                }
                entry<Register> {
                    RegisterScreen()
                }
                entry<Products> {

                }
            }
        )
    }
}
