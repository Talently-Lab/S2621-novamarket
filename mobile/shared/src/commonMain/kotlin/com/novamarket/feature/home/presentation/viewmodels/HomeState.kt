package com.novamarket.feature.home.presentation.viewmodels

data class HomeState(
    val loading : Boolean = false,
    val currentSection: HomeSection = HomeSection.START_HOME
)

enum class HomeSection {
    START_HOME,
    MENU,
    CATALOGO
}
