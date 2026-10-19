package com.novamarket.feature.authentication.presentation.viewmodels

data class RegisterState(
    val loading : Boolean = false,
    val success : Boolean = false,
    val error : Boolean = true
)
