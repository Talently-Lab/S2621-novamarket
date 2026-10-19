package com.novamarket.feature.authentication.presentation.viewmodels

data class RegisterState(
    val loading : Boolean = true,
    val success : Boolean = false,
    val error : Boolean = false
)
