package com.novamarket.feature.home.presentation.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
fun TechAccessoryCard(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF101C2B)
        ),
        border = BorderStroke(1.dp, Color(0xFF132238))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = "TECNOLOGÍA PARA TODOS LOS DÍAS",
                color = Color(0xFFD5F476),
                fontSize = 12.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 18.sp,
            )

            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Encontrá tu\npróximo accesorio\ntecnológico",
                color = Color.White,
                fontSize = 32.sp,
                fontWeight = FontWeight.SemiBold,
                lineHeight = 40.sp
            )

            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Explorá accesorios, periféricos y\ngadgets.",
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 24.sp
            )

            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = { /* Acción del botón */ },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFD5F476)
                ),
                contentPadding = PaddingValues(horizontal = 16.dp)
            ) {
                Text(
                    text = "Explorar catálogo",
                    color = Color(0xFF132238),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(168.dp)
                    .background(
                        color = Color(0xFFE9EFF7),
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
        }
    }
}
