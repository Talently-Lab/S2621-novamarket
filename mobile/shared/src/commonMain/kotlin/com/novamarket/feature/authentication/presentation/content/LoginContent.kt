package com.novamarket.feature.authentication.presentation.content

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.novamarket.core.ui.components.MyFooter
import com.novamarket.core.ui.components.MyTopBar
import com.novamarket.feature.authentication.presentation.components.CartItem
import com.novamarket.feature.authentication.presentation.components.EmailField
import com.novamarket.feature.authentication.presentation.components.PasswordField

@Composable
fun LoginContent() {
    val scrollState = rememberScrollState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    Scaffold(
        modifier = Modifier.statusBarsPadding(),
        topBar = {
            Column {
                MyTopBar(
                    cartCount = 2,
                    onMenuClick = { },
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
                Text(
                    text = "TU COMPRA / ACCESO",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.W400,
                    lineHeight = 14.sp,
                    color = Color(0xFF616161)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Iniciá sesión",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.W600,
                    lineHeight = 32.sp,
                    color = Color(0xFF1F1F1F)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Conservamos tu carrito para que puedas continuar.",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.W400,
                    lineHeight = 18.sp,
                    color = Color(0xFF616161)
                )
                Spacer(modifier = Modifier.height(10.dp))
                EmailField(
                    value = email,
                    onValueChange = { email = it }
                )
                Spacer(modifier = Modifier.height(10.dp))
                PasswordField(
                    value = password,
                    showPassword = showPassword,
                    onValueChange = { password = it }
                )
                Spacer(modifier = Modifier.height(5.dp))
                Text(
                    text = if (showPassword) "Ocultar contraseña" else "Mostrar contraseña",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.W400,
                    lineHeight = 14.sp,
                    color = Color(0xFF616161),
                    modifier = Modifier.clickable { showPassword = !showPassword }
                )
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = {},
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RectangleShape,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF1F1F1F),
                        contentColor = Color.White
                    )
                ) {
                    Text(
                        text = "Iniciar sesión y continuar",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.W500
                    )
                }
                Spacer(modifier = Modifier.height(3.dp))
                OutlinedButton(
                    onClick = {},
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RectangleShape,
                    border = BorderStroke(1.dp, Color(0xFFB8B8B8)),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = Color.White,
                        contentColor = Color(0xFF1F1F1F)
                    )
                ) {
                    Text(
                        text = "Crear una cuenta",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.W500
                    )
                }
                Spacer(modifier = Modifier.height(3.dp))
                OutlinedButton(
                    onClick = {},
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RectangleShape,
                    border = BorderStroke(1.dp, Color(0xFFB8B8B8)),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = Color.White,
                        contentColor = Color(0xFF1F1F1F)
                    )
                ) {
                    Text(
                        text = "Volver al carrito",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.W500
                    )
                }
                Spacer(modifier = Modifier.height(5.dp))
                CartItem()
            }
            Spacer(modifier = Modifier.height(10.dp))
            MyFooter()
        }
    }
}
