package com.novamarket.feature.home.presentation.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import novamarket.shared.generated.resources.Res
import novamarket.shared.generated.resources.headphones2
import org.jetbrains.compose.resources.painterResource

@Composable
fun ProductCard(product: Product) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        border = BorderStroke(1.dp, Color(0xFFD2DAE5))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(112.dp)
                    .background(
                        color = Color(0xFFE9EFF7),
                        shape = RoundedCornerShape(16.dp)
                    )
                    .border(
                        width = 1.dp,
                        color = Color(0xFFD2DAE5),
                        shape = RoundedCornerShape(16.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(Res.drawable.headphones2),
                    contentDescription = "",
                    modifier = Modifier.size(120.dp)
                )
            }
            Text(
                text = product.name,
                color = Color(0xFF132238),
                fontSize = 16.sp,
                fontWeight = FontWeight.W600,
                lineHeight = 23.sp
            )
            Text(
                text = product.brand,
                color = Color(0xFF576477),
                fontSize = 12.sp,
                fontWeight = FontWeight.W400,
                lineHeight = 18.sp
            )
            Text(
                text = product.price,
                color = Color(0xFF132238),
                fontSize = 20.sp,
                fontWeight = FontWeight.W600,
                lineHeight = 28.sp
            )
            Text(
                text = product.availability,
                color = Color(0xFF13724D),
                fontSize = 12.sp,
                fontWeight = FontWeight.W400,
                lineHeight = 18.sp
            )
            OutlinedButton(
                onClick = { },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(
                    width = 1.dp,
                    Color(0xFF7D8BA0)
                ),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = Color.White,
                    contentColor = Color(0xFF132238)
                ),
                contentPadding = PaddingValues(horizontal = 16.dp)
            ) {
                Text(
                    text = "Ver producto",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
fun ProductListGrid() {
    val products = listOf(
        Product(1, "Mouse inalámbrico", "Marca de ejemplo", "$ 45.000", "Disponible"),
        Product(2, "Teclado compacto", "Marca de ejemplo", "$ 25.000", "Disponible"),
        Product(3, "Reloj inteligente", "Marca de ejemplo", "$ 60.000", "Disponible"),
        Product(4, "Cargador USB-C", "Marca de ejemplo", "$ 18.000", "Disponible")
    )
    Text(
        text = "Productos destacados",
        color = Color(0xFF132238),
        fontSize = 20.sp,
        fontWeight = FontWeight.W600
    )
    Spacer(modifier = Modifier.height(4.dp))
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        userScrollEnabled = false,
        modifier = Modifier.heightIn(max = 1000.dp)
    ) {
        items(products) { product ->
            ProductCard(product = product)
        }
    }
}

data class Product(
    val id: Int,
    val name: String,
    val brand: String,
    val price: String,
    val availability: String
)
