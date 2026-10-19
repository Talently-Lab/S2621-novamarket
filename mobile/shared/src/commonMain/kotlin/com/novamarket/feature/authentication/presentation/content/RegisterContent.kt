package com.novamarket.feature.authentication.presentation.content

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
import com.novamarket.feature.authentication.presentation.components.EmailField
import com.novamarket.feature.authentication.presentation.components.InfoRegisterCard
import com.novamarket.feature.authentication.presentation.components.LastNameField
import com.novamarket.feature.authentication.presentation.components.NameField
import com.novamarket.feature.authentication.presentation.components.PasswordField
import com.novamarket.feature.authentication.presentation.viewmodels.RegisterState
import com.novamarket.feature.authentication.presentation.viewmodels.RegisterViewModel

@Composable
fun RegisterContent(
    viewModel: RegisterViewModel,
    state: RegisterState
) {
    val scrollState = rememberScrollState()
    var name by remember { mutableStateOf("") }
    var lastname by remember { mutableStateOf("") }
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
                if (!state.success) {
                    Text(
                        text = "TU COMPRA / CREAR CUENTA",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.W400,
                        lineHeight = 14.sp,
                        color = Color(0xFF616161)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Creá tu cuenta",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.W600,
                        lineHeight = 32.sp,
                        color = Color(0xFF1F1F1F)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Registrate para continuar. Tu carrito se conserva.",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.W400,
                        lineHeight = 18.sp,
                        color = Color(0xFF616161)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    NameField(
                        value = name,
                        onValueChange = { name = it }
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    LastNameField(
                        value = lastname,
                        onValueChange = { lastname = it }
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    EmailField(
                        value = email,
                        onValueChange = { email = it }
                    )
                    if (state.error) {
                        Text(
                            text = "Ingresá un correo electrónico válido.",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.W400,
                            lineHeight = 14.sp,
                            color = Color(0xFF616161)
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    PasswordField(
                        value = password,
                        onValueChange = { password = it },
                        showPassword = showPassword
                    )
                    Text(
                        text = "Mínimo 8 caracteres, una letra y un número.",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.W400,
                        lineHeight = 14.sp,
                        color = Color(0xFF616161)
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
                        ),
                        enabled = name.isNotBlank() && lastname.isNotBlank() && email.isNotBlank()
                                && password.isNotBlank()
                    ) {
                        Text(
                            text = if (!state.error) "Crear cuenta" else "Revisá los campos indicados",
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
                            text = "Ya tengo cuenta: Iniciar sesión",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.W500
                        )
                    }
                    Spacer(modifier = Modifier.height(5.dp))
                    InfoRegisterCard(
                        title = "Después del registro",
                        description = "Iniciá sesión con tu cuenta nueva para revisar y confirmar el pedido. La compra es simulada."
                    )
                } else {
                    Text(
                        text = "CUENTA CREADA",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.W400,
                        lineHeight = 14.sp,
                        color = Color(0xFF616161)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Ya podés iniciar sesión",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.W600,
                        lineHeight = 32.sp,
                        color = Color(0xFF1F1F1F)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Ingresá con el correo y la contraseña que acabás de registrar.",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.W400,
                        lineHeight = 18.sp,
                        color = Color(0xFF616161)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    InfoRegisterCard(
                        title = "Tu carrito se conserva",
                        description = "Todavía no confirmaste la compra. Después de iniciar sesión vas a volver al checkout."
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
                            text = "Iniciar sesión",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.W500
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
            MyFooter()
        }
    }
}
