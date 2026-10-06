package com.novamarket.feature.authentication.data.repositories

import com.novamarket.core.network.Response
import com.novamarket.feature.authentication.data.dto.LoginRequest
import com.novamarket.feature.authentication.data.mapper.LoginMapper.toDomain
import com.novamarket.feature.authentication.data.remote.LoginApi
import com.novamarket.feature.authentication.domain.models.Login
import com.novamarket.feature.authentication.domain.repositories.LoginRepository

class LoginRepositoryImp(
    val api: LoginApi
) : LoginRepository {
    override suspend fun loginUser(request: LoginRequest): Response<Login> {
        return when (val response = api.login(request)) {
            is Response.Success -> {
                Response.Success(response.data.toDomain())
            }
            is Response.Failed -> {
                Response.Failed(message = response.message, exception = response.exception)
            }
        }
    }
}
