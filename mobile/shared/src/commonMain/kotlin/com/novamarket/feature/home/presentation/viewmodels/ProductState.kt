package com.novamarket.feature.home.presentation.viewmodels

sealed interface ProductState {
    data object Loading : ProductState
    data object Empty : ProductState
    data class Error(val message: String) : ProductState
    data object Success : ProductState
}
