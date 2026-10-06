package com.novamarket.feature.authentication.data.mapper

import com.novamarket.feature.authentication.data.dto.LoginResponse
import com.novamarket.feature.authentication.domain.models.Login

object LoginMapper {
    fun LoginResponse.toDomain(): Login {
        return Login(
            message = message
        )
    }
}
