package com.novamarket.feature.authentication.di

import com.novamarket.feature.authentication.data.remote.LoginApi
import com.novamarket.feature.authentication.data.repositories.LoginRepositoryImp
import com.novamarket.feature.authentication.domain.repositories.LoginRepository
import com.novamarket.feature.authentication.presentation.viewmodels.LoginViewModel
import org.koin.core.module.dsl.factoryOf
import org.koin.dsl.module

val auth = module {
    single { LoginApi(get()) }
    single<LoginRepository> { LoginRepositoryImp(get()) }
    factoryOf(::LoginViewModel)
}
