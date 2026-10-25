package com.novamarket.feature.home.di

import com.novamarket.feature.home.presentation.viewmodels.HomeViewModel
import com.novamarket.feature.home.presentation.viewmodels.ProductsViewModel
import org.koin.core.module.dsl.factoryOf
import org.koin.dsl.module

val homeModule = module {
    factoryOf(::HomeViewModel)
    factoryOf(::ProductsViewModel)
}
