package com.novamarket.feature.home.presentation.viewmodels

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class ProductsViewModel(

) : ViewModel() {
    private val _uiState = MutableStateFlow<ProductState>(ProductState.Loading)
    val uiState = _uiState.asStateFlow()
}
