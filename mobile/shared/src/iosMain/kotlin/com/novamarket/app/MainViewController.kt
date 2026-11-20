package com.novamarket.app

import androidx.compose.ui.window.ComposeUIViewController
import com.novamarket.core.di.initKoin
import platform.UIKit.UIViewController

fun MainViewController(): UIViewController {
    initKoin()
    return ComposeUIViewController { App() }
}
