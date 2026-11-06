package com.novamarket.feature.home.presentation.screen

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.novamarket.core.ui.components.LoadingScreen
import com.novamarket.feature.home.presentation.components.EmptyProducts
import com.novamarket.feature.home.presentation.components.ErrorProduct
import com.novamarket.feature.home.presentation.content.ProductsContent
import com.novamarket.feature.home.presentation.viewmodels.ProductState
import com.novamarket.feature.home.presentation.viewmodels.ProductsViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun ProductsScreen(
    viewModel: ProductsViewModel = koinViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    when (state) {
        is ProductState.Loading -> {
            LoadingScreen()
        }

        is ProductState.Empty -> {
            EmptyProducts()
        }

        is ProductState.Error -> {
            ErrorProduct()
        }

        is ProductState.Success -> {
            ProductsContent(viewModel = viewModel)
        }
    }
}
