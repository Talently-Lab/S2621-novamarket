package com.novamarket.feature.authentication.presentation.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun CartItem(
    title: String = "Tu carrito sigue acá",
    firstItem: String = "1",
    secondItem: String = "1",
    referenceTotal: String = "$ 70.000",
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RectangleShape,
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFF5F5F5)
        ),
        border = BorderStroke(1.dp, Color(0xFFDCDCDC))
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontSize = 20.sp,
                fontWeight = FontWeight.W600,
                color = Color(0xFF1F1F1F)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Mouse inalámbrico × $firstItem",
                style = MaterialTheme.typography.bodyMedium,
                fontSize = 16.sp,
                fontWeight = FontWeight.W400,
                color = Color(0xFF616161)
            )

            Text(
                text = "Teclado compacto × $secondItem",
                style = MaterialTheme.typography.bodyMedium,
                fontSize = 16.sp,
                fontWeight = FontWeight.W400,
                color = Color(0xFF616161)
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Total de referencia: $referenceTotal",
                style = MaterialTheme.typography.bodyMedium,
                fontSize = 16.sp,
                fontWeight = FontWeight.W400,
                color = Color(0xFF616161)
            )
        }
    }
}
