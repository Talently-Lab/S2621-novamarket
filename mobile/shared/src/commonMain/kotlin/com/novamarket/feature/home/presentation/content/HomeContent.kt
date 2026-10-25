package com.novamarket.feature.home.presentation.content

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.novamarket.core.ui.components.MyFooter
import com.novamarket.core.ui.components.MyTopBar
import com.novamarket.feature.home.presentation.components.ExploreCategoriesSection
import com.novamarket.feature.home.presentation.components.ProductListGrid
import com.novamarket.feature.home.presentation.components.TechAccessoryCard
import com.novamarket.feature.home.presentation.screen.ProductsScreen
import com.novamarket.feature.home.presentation.viewmodels.HomeSection
import com.novamarket.feature.home.presentation.viewmodels.HomeState
import com.novamarket.feature.home.presentation.viewmodels.HomeViewModel

@Composable
fun HomeContent(
    viewModel: HomeViewModel,
    state: HomeState
) {
    val scrollState = rememberScrollState()

    Scaffold(
        modifier = Modifier.statusBarsPadding(),
        topBar = {
            Column {
                MyTopBar(
                    cartCount = 2,
                    onMenuClick = { viewModel.onSectionChange(HomeSection.MENU) },
                    onCartClick = { },
                    onSearchClick = { }
                )
                HorizontalDivider(
                    modifier = Modifier.padding(horizontal = 0.dp),
                    thickness = 1.dp,
                    color = Color(0xFFB8B8B8)
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .padding(paddingValues)
                .fillMaxSize()
                .background(color = Color.White)
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 20.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                when (state.currentSection) {
                    HomeSection.START_HOME -> StartHome()
                    HomeSection.MENU -> {
                        MenuHome(
                            goToStartHome = {
                                viewModel.onSectionChange(HomeSection.START_HOME)
                            },
                            onMenuItemClick = {
                                when(it){
                                    "Inicio" -> viewModel.onSectionChange(HomeSection.START_HOME)
                                    "Catálogo" -> viewModel.onSectionChange(HomeSection.CATALOGO)
                                    "Mi cuenta" -> {}
                                    "Carrito" -> {}
                                }
                            }
                        )
                    }
                    HomeSection.CATALOGO -> {
                        ProductsScreen()
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
            MyFooter()
        }
    }
}

@Composable
fun StartHome() {
    TechAccessoryCard()
    Spacer(modifier = Modifier.height(5.dp))
    ExploreCategoriesSection(
        onCategorySelected = {

        }
    )
    Spacer(modifier = Modifier.height(5.dp))
    ProductListGrid()
}

@Composable
fun MenuHome(
    goToStartHome: () -> Unit,
    onMenuItemClick: (String) -> Unit
) {
    val menuItems = listOf("Inicio", "Catálogo", "Mi cuenta", "Carrito")
    Text(
        text = "NAVEGACIÓN",
        color = Color(0xFF576477),
        fontSize = 12.sp,
        fontWeight = FontWeight.W400
    )
    Text(
        text = "Menú",
        color = Color(0xFF132238),
        fontSize = 32.sp,
        fontWeight = FontWeight.W600
    )
    Spacer(modifier = Modifier.height(8.dp))
    menuItems.forEach { item ->
        OutlinedButton(
            onClick = { onMenuItemClick(item) },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(10.dp),
            border = BorderStroke(1.dp, Color(0xFF7D8BA0)),
            colors = ButtonDefaults.outlinedButtonColors(
                containerColor = Color(0xFFFFFFFF)
            )
        ) {
            Text(
                text = item,
                color = Color(0xFF132238),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
    }
    Button(
        onClick = goToStartHome,
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(10.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF132238)
        )
    ) {
        Text(
            text = "Volver al inicio",
            color = Color(0xFFFFFFFF),
            fontSize = 14.sp,
            fontWeight = FontWeight.W500
        )
    }
}
