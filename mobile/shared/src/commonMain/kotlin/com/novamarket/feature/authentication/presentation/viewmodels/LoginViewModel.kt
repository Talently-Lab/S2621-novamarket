package com.novamarket.feature.authentication.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.novamarket.core.network.Response
import com.novamarket.feature.authentication.data.dto.LoginRequest
import com.novamarket.feature.authentication.domain.repositories.LoginRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class LoginViewModel(
    private val repository: LoginRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(LoginState())
    val uiState get() = _uiState.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true) }
            val request = LoginRequest(email = email, password = password)
            when (val result = repository.loginUser(request = request)) {
                is Response.Success -> {
                    _uiState.update { it.copy(loading = false, data = result.data) }
                }

                is Response.Failed -> {
                    _uiState.update { it.copy(loading = false) }
                }
            }
        }
    }
}
