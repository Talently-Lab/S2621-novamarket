package com.novamarket.feature.authentication.presentation.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmailField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = "Correo electrónico",
            fontSize = 14.sp,
            fontWeight = FontWeight.W500,
            color = Color(0xFF1F1F1F)
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            placeholder = {
                Text(
                    text = "nombre@correo.com",
                    fontSize = 14.sp,
                    color = Color(0xFF9E9E9E)
                )
            },
            shape = RectangleShape,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedBorderColor = Color(0xFFB8B8B8),
                unfocusedBorderColor = Color(0xFFB8B8B8),
                focusedTextColor = Color(0xFF1F1F1F),
                unfocusedTextColor = Color(0xFF1F1F1F)
            ),
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Next
            )
        )
    }
}

@Composable
fun PasswordField(
    value: String,
    showPassword : Boolean,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = "Contraseña",
            fontSize = 14.sp,
            fontWeight = FontWeight.W500,
            color = Color(0xFF1F1F1F)
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            placeholder = {
                Text(
                    text = "••••••••",
                    fontSize = 14.sp,
                    color = Color(0xFF9E9E9E)
                )
            },
            shape = RectangleShape,
            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedBorderColor = Color(0xFFB8B8B8),
                unfocusedBorderColor = Color(0xFFB8B8B8),
                focusedTextColor = Color(0xFF1F1F1F),
                unfocusedTextColor = Color(0xFF1F1F1F)
            ),
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Done
            )
        )
    }
}
