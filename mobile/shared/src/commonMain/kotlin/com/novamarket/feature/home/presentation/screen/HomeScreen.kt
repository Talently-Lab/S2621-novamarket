package com.novamarket.feature.home.presentation.screen

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.novamarket.feature.home.presentation.content.HomeContent
import com.novamarket.feature.home.presentation.viewmodels.HomeViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun HomeScreen(
    viewModel: HomeViewModel = koinViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    HomeContent(
        viewModel = viewModel,
        state = state
    )
}
