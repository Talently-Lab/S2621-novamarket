package com.novamarket.core.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun MyFooter(
    title: String = "NovaMarket",
    subtitle: String = "Tecnología y electrónica",
    buttonText: String = "Volver al catálogo",
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RectangleShape,
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFF5F5F5)
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = title,
                style = TextStyle(
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp,
                    lineHeight = 22.sp,
                    color = Color(0xFF1F1F1F)
                )
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = subtitle,
                style = TextStyle(
                    fontWeight = FontWeight.Normal,
                    fontSize = 12.sp,
                    lineHeight = 15.4.sp,
                    color = Color(0xFF616161)
                )
            )

            Spacer(modifier = Modifier.height(24.dp))
            OutlinedButton(
                onClick = { },
                modifier = Modifier
                    .width(327.dp)
                    .height(48.dp),
                shape = RectangleShape,
                border = BorderStroke(1.dp, Color(0xFFB8B8B8)),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = Color(0xFFFFFFFF),
                    contentColor = Color(0xFF1F1F1F)
                ),
                contentPadding = PaddingValues(16.dp)
            ) {
                Text(
                    text = buttonText,
                    style = TextStyle(
                        fontWeight = FontWeight.Medium,
                        fontSize = 14.sp
                    )
                )
            }
        }
    }
}
