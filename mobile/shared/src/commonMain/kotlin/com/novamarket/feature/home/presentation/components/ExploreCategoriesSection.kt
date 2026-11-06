package com.novamarket.feature.home.presentation.components

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ExploreCategoriesSection(
    onCategorySelected: (String) -> Unit
) {
    val categories = listOf(
        "Accesorios para celulares",
        "Gaming y periféricos",
        "Relojes inteligentes",
        "Gadgets y electrónica"
    )

    Text(
        text = "Explorá por categoría",
        color = Color(0xFF132238),
        fontSize = 20.sp,
        fontWeight = FontWeight.SemiBold,
        lineHeight = 28.sp
    )
    Spacer(modifier = Modifier.height(8.dp))
    categories.forEach { category ->
        Button(
            onClick = { onCategorySelected(category) },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFFE9EFF7),
                contentColor = Color(0xFF132238)
            ),
            elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
        ) {
            Text(
                text = category,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }

}
