package com.novamarket.feature.authentication.data.dto
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
@Serializable
data class LoginResponse(
    @SerialName("message")
    val message: String
)
