package com.novamarket.feature.authentication.presentation.screen

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.novamarket.core.ui.components.LoadingScreen
import com.novamarket.feature.authentication.presentation.content.RegisterContent
import com.novamarket.feature.authentication.presentation.viewmodels.RegisterViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun RegisterScreen(
    viewModel: RegisterViewModel = koinViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    RegisterContent(
        viewModel = viewModel,
        state = state
    )

    if (state.loading) {
        LoadingScreen()
    }
}
