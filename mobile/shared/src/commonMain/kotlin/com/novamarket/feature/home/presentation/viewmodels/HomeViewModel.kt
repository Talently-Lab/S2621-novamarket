package com.novamarket.feature.home.presentation.viewmodels

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class HomeViewModel(

) : ViewModel() {
    private val _uiState = MutableStateFlow(HomeState())
    val uiState get() = _uiState.asStateFlow()

    fun onSectionChange(newSection: HomeSection) {
        _uiState.update { currentState ->
            currentState.copy(currentSection = newSection)
        }
    }
}
