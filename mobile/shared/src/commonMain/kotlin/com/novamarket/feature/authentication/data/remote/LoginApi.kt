package com.novamarket.feature.authentication.data.remote

import com.novamarket.core.network.Response
import com.novamarket.core.network.ServiceConstants.BASE_URL
import com.novamarket.feature.authentication.data.dto.LoginRequest
import com.novamarket.feature.authentication.data.dto.LoginResponse
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import kotlinx.io.IOException
import kotlinx.serialization.SerializationException

class LoginApi(
    private val client: HttpClient
) {
    suspend fun login(request: LoginRequest): Response<LoginResponse> {
        return try {
            val response = client.post("$BASE_URL/api/auth/login") {
                setBody(body = request)
            }
            when (response.status.value) {
                in 200..299 -> Response.Success(response.body())
                in 500..599 -> Response.Failed(message = "Error del servidor")
                else -> Response.Failed(message = "Error HTTP: ${response.status}")
            }
        } catch (e: IOException) {
            Response.Failed(message = "Sin conexión: ${e.message}", exception = e)
        } catch (e: SerializationException) {
            Response.Failed(message = "Error al parsear respuesta", exception = e)
        }
    }
}
