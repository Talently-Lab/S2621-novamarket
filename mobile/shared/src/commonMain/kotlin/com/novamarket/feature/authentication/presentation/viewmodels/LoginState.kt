package com.novamarket.feature.authentication.presentation.viewmodels

import com.novamarket.feature.authentication.domain.models.Login

data class LoginState(
    val loading : Boolean = false,
    val data : Login? = null
)
