package com.novamarket.feature.authentication.presentation.viewmodels

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class RegisterViewModel(

) : ViewModel() {
    private val _uiState = MutableStateFlow(RegisterState())
    val uiState get() = _uiState.asStateFlow()
}
