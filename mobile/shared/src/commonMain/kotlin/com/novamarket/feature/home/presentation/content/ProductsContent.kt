package com.novamarket.feature.home.presentation.content

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.novamarket.feature.home.presentation.components.Product
import com.novamarket.feature.home.presentation.components.ProductCard
import com.novamarket.feature.home.presentation.viewmodels.ProductsViewModel

@Composable
fun ProductsContent(
    viewModel: ProductsViewModel
) {
    val products = listOf(
        Product(1, "Mouse inalámbrico", "Marca de ejemplo", "$ 45.000", "Disponible"),
        Product(2, "Teclado compacto", "Marca de ejemplo", "$ 25.000", "Disponible"),
        Product(3, "Reloj inteligente", "Marca de ejemplo", "$ 60.000", "Disponible"),
        Product(4, "Cargador USB-C", "Marca de ejemplo", "$ 18.000", "Disponible"),
        Product(5, "Cargador USB-C", "Marca de ejemplo", "$ 18.000", "Disponible"),
        Product(6, "Cargador USB-C", "Marca de ejemplo", "$ 18.000", "Disponible")
    )
    Text(
        text = "INICIO / CATÁLOGO",
        color = Color(0xFF576477),
        fontSize = 12.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 18.sp
    )
    Text(
        text = "Catálogo",
        color = Color(0xFF132238),
        fontSize = 32.sp,
        fontWeight = FontWeight.SemiBold,
        lineHeight = 40.sp
    )
    Text(
        text = "Tecnología y electrónica.",
        color = Color(0xFF576477),
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 24.sp
    )
    Spacer(modifier = Modifier.height(16.dp))
    OutlinedButton(
        onClick = { /* TODO: Acción del botón */ },
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, Color(0xFF7D8BA0)),
        colors = ButtonDefaults.outlinedButtonColors(
            containerColor = Color(0xFFFFFFFF)
        ),
        contentPadding = PaddingValues(horizontal = 16.dp)
    ) {
        Text(
            text = "Categorías y filtros",
            color = Color(0xFF132238),
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 20.sp
        )
    }
    Spacer(modifier = Modifier.height(16.dp))
    Text(
        text = "6 de 18 productos",
        color = Color(0xFF576477),
        fontSize = 14.sp,
        fontWeight = FontWeight.Medium,
        lineHeight = 20.sp
    )
    Spacer(modifier = Modifier.height(8.dp))
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
    Spacer(modifier = Modifier.height(10.dp))
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .weight(1f)
                .height(48.dp)
                .alpha(0.45f)
                .clip(RoundedCornerShape(10.dp))
                .background(Color(0xFFE9EFF7)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Anterior",
                color = Color(0xFF576477),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )
        }
        Box(
            modifier = Modifier
                .weight(1f)
                .height(48.dp)
                .border(width = 1.dp, color = Color(0xFF7D8BA0), shape = RoundedCornerShape(10.dp))
                .background(color = Color(0xFFFFFFFF), shape = RoundedCornerShape(10.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "1 de 3",
                color = Color(0xFF132238),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )
        }
        Box(
            modifier = Modifier
                .weight(1f)
                .height(48.dp)
                .clip(RoundedCornerShape(10.dp))
                .border(width = 1.dp, color = Color(0xFF7D8BA0), shape = RoundedCornerShape(10.dp))
                .background(color = Color(0xFFFFFFFF))
                .clickable {  },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Siguiente",
                color = Color(0xFF132238),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
