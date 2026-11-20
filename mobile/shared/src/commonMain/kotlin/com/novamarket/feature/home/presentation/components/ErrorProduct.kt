package com.novamarket.feature.home.presentation.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ErrorProduct() {
    Text(
        text = "ERROR DE CATÁLOGO",
        style = TextStyle(
            fontWeight = FontWeight.W400,
            fontSize = 12.sp,
            lineHeight = 18.sp,
            color = Color(0xFF576477)
        )
    )
    Text(
        text = "No pudimos cargar el catálogo",
        style = TextStyle(
            fontWeight = FontWeight.W600,
            fontSize = 32.sp,
            lineHeight = 40.sp,
            color = Color(0xFF132238)
        )
    )
    Spacer(modifier = Modifier.height(16.dp))
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.Transparent
        ),
        border = BorderStroke(1.dp, Color(0xFFDDE1E6))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "Error de catálogo",
                style = TextStyle(
                    fontWeight = FontWeight.W600,
                    fontSize = 20.sp,
                    lineHeight = 28.sp,
                    color = Color(0xFF132238)
                )
            )
            Text(
                text = "Revisá tu conexión e intentá nuevamente.",
                style = TextStyle(
                    fontWeight = FontWeight.W400,
                    fontSize = 16.sp,
                    lineHeight = 24.sp,
                    color = Color(0xFF576477)
                )
            )
        }
    }
    Spacer(modifier = Modifier.height(24.dp))
    Button(
        onClick = { },
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(10.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF132238)
        )
    ) {
        Text(
            text = "Reintentar",
            style = TextStyle(
                fontWeight = FontWeight.W500,
                fontSize = 14.sp,
                lineHeight = 20.sp,
                color = Color(0xFFFFFFFF)
            )
        )
    }
}
