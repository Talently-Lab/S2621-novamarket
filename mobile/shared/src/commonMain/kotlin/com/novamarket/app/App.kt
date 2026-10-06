package com.novamarket.app

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.novamarket.feature.authentication.presentation.screen.LoginScreen

@Composable
@Preview
fun App() {
    MaterialTheme {
        LoginScreen()
    }
}
