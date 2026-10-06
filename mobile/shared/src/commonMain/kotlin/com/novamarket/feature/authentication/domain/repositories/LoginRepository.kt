package com.novamarket.feature.authentication.domain.repositories

import com.novamarket.core.network.Response
import com.novamarket.feature.authentication.data.dto.LoginRequest
import com.novamarket.feature.authentication.domain.models.Login

interface LoginRepository {
    suspend fun loginUser(request: LoginRequest): Response<Login>
}
