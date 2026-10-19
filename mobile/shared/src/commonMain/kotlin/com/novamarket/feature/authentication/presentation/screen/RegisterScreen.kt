package com.novamarket.feature.authentication.presentation.screen

import androidx.compose.runtime.Composable
import com.novamarket.feature.authentication.presentation.content.RegisterContent
import com.novamarket.feature.authentication.presentation.viewmodels.RegisterViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun RegisterScreen(
    viewModel: RegisterViewModel = koinViewModel()
) {
    RegisterContent(viewModel = viewModel)
}
