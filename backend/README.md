# NovaMarket Backend

API REST del proyecto **NovaMarket — E-commerce MVP**, desarrollada por el equipo Backend del grupo **S2621 de Talently Lab**.

Este directorio contiene la implementación del Backend de NovaMarket, encargado de gestionar la lógica de negocio, persistencia de datos, autenticación, productos, categorías y órdenes del sistema.

> **Estado:** En desarrollo.

---

## Tecnologías

El Backend utiliza actualmente:

- **Node.js** 20.19+
- **Express**
- **MongoDB**
- **Mongoose**
- **dotenv**
- **CORS**
- **Nodemon**
- **Postman** para pruebas de endpoints

Tecnologías previstas para autenticación:

- **bcrypt** para hash de contraseñas.
- **JWT** para autenticación mediante tokens.

---

## Arquitectura general

NovaMarket utiliza una arquitectura de API REST basada en JSON.

Durante el entorno de desarrollo:

```text
Frontend
http://localhost:5173
        |
        | HTTP / JSON
        v
Backend API
http://localhost:3000
        |
        | Mongoose
        v
MongoDB
```

El Frontend consume los recursos expuestos por el Backend a través del prefijo:

```text
/api
```

---

## Requisitos

Para ejecutar el Backend localmente se necesita:

- Node.js 20.19 o superior.
- npm.
- Acceso a una instancia de MongoDB.
- Variables de entorno configuradas.

Para comprobar la versión instalada de Node.js:

```bash
node -v
```

Para comprobar npm:

```bash
npm -v
```

---

## Instalación

Clonar el repositorio y posicionarse dentro de la carpeta del Backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

---

## Variables de entorno

Crear un archivo:

```text
backend/.env
```

tomando como referencia:

```text
backend/.env.example
```

Variables utilizadas o previstas actualmente:

```env
PORT=3000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=8h
```

### Importante

El archivo `.env` puede contener información sensible y **no debe versionarse ni subirse al repositorio**.

La configuración real de MongoDB debe almacenarse únicamente en:

```env
MONGODB_URI=
```

No incluir usuarios, contraseñas ni cadenas de conexión reales en el README.

---

## Base de datos

NovaMarket utiliza **MongoDB** como base de datos.

Actualmente se configuró **MongoDB Atlas** para disponer de una instancia de desarrollo accesible por el equipo.

La aplicación no está acoplada directamente a Atlas. La conexión se obtiene mediante:

```env
MONGODB_URI=
```

Por lo tanto, es posible utilizar otra instancia compatible de MongoDB modificando la variable de entorno sin alterar la lógica de conexión de la aplicación.

La conexión se encuentra centralizada en:

```text
src/config/db.js
```

y utiliza **Mongoose** para establecer la comunicación entre Node.js y MongoDB.

### Colecciones previstas para el MVP

Según el contrato actual del Backend:

```text
users
categories
products
orders
```

No se utiliza una colección de carrito. El carrito será administrado por el Frontend y será validado nuevamente por el Backend al crear una orden.

---

## Ejecutar el Backend

### Desarrollo

```bash
npm run dev
```

Este comando utiliza Nodemon para reiniciar automáticamente el servidor cuando se detectan modificaciones.

### Ejecución normal

```bash
npm start
```

Por defecto, la API utiliza:

```text
http://localhost:3000
```

Si existe una variable `PORT`, el Backend utilizará el puerto configurado en ella.

---

## Health Check

Existe un endpoint técnico para verificar que la API se encuentra funcionando.

### Request

```http
GET /api/health
```

### URL local

```text
http://localhost:3000/api/health
```

### Respuesta esperada

```json
{
  "status": "ok",
  "message": "NovaMarket API funcionando"
}
```

---

## Estructura actual del Backend

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── auth.routes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidad de cada directorio

- `config/`: configuración del Backend y conexión con servicios externos, actualmente MongoDB.
- `controllers/`: lógica asociada a los endpoints.
- `middlewares/`: middlewares de autenticación, autorización y manejo de errores.
- `models/`: esquemas y modelos de Mongoose.
- `routes/`: definición de rutas HTTP.
- `app.js`: configuración principal de Express.
- `server.js`: conexión con MongoDB e inicio del servidor.

---

# Autenticación

La autenticación se desarrolla progresivamente durante el Sprint 2.

Los roles definidos para el MVP son:

```text
CLIENT
ADMIN
```

Un usuario registrado públicamente debe recibir automáticamente el rol:

```text
CLIENT
```

El rol no debe ser enviado ni definido por el cliente durante el registro.

---

## Modelo User

El modelo actual se encuentra en:

```text
src/models/User.js
```

Campos definidos:

```text
name
lastName
email
passwordHash
role
createdAt
updatedAt
```

### Reglas principales

- `name` es obligatorio.
- `lastName` es obligatorio.
- `email` es obligatorio.
- `email` debe ser único.
- Los emails se almacenan en minúsculas.
- `passwordHash` es obligatorio.
- Las contraseñas no deben almacenarse en texto plano.
- `role` admite `CLIENT` o `ADMIN`.
- El rol por defecto es `CLIENT`.
- Mongoose administra automáticamente `createdAt` y `updatedAt`.

---

# Registro de usuario

## Endpoint

```http
POST /api/auth/register
```

URL local:

```text
http://localhost:3000/api/auth/register
```

El endpoint es público y no requiere autenticación.

### Request

```json
{
  "name": "Juan",
  "lastName": "Perez",
  "email": "juan@example.com",
  "password": "password123"
}
```

El campo `role` no debe enviarse durante el registro.

---

## Política de contraseña

Según el contrato actual del Backend, la contraseña debe:

- Tener un mínimo de 8 caracteres.
- Contener al menos una letra.
- Contener al menos un número.

La implementación del hash y las validaciones asociadas se integrarán con la tarea correspondiente de autenticación.

---

## Respuesta esperada del registro

Cuando la implementación del registro esté completa, una creación correcta deberá responder:

```http
201 Created
```

con:

```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": "USER_ID",
    "name": "Juan",
    "lastName": "Perez",
    "email": "juan@example.com",
    "role": "CLIENT"
  }
}
```

La respuesta nunca debe incluir:

```text
password
passwordHash
```

---

## Estado actual de BACK-001-S2

Tarjeta:

```text
BACK-001-S2 | Modelo usuario y endpoint de registro
```

Actualmente se encuentran implementados:

- Base inicial de Express.
- Conexión con MongoDB mediante Mongoose.
- Configuración mediante variables de entorno.
- Modelo `User`.
- Ruta `POST /api/auth/register`.
- Controller de registro.
- Lectura del body JSON.
- Validación inicial de campos obligatorios.
- Búsqueda de usuario existente por email.
- Respuesta `400 VALIDATION_ERROR`.
- Respuesta `409 EMAIL_ALREADY_EXISTS`.
- Rol `CLIENT` por defecto en el modelo.
- Prueba inicial del endpoint mediante Postman.

### Pendiente de integración

La creación efectiva del usuario se encuentra pendiente de integrar el hash de contraseña.

El flujo esperado será:

```text
password
   |
   v
bcrypt
   |
   v
passwordHash
   |
   v
User.create()
   |
   v
MongoDB
```

Esta funcionalidad se relaciona con:

```text
BACK-002-S2 | Hash de contraseña y manejo de errores
```

No se debe almacenar temporalmente `password` como `passwordHash` ni persistir contraseñas en texto plano.

---

# Pruebas con Postman

Actualmente se verificó la conexión del endpoint de registro mediante Postman.

### Request utilizado

```http
POST http://localhost:3000/api/auth/register
```

Body:

```json
{}
```

### Resultado esperado y verificado

```http
400 Bad Request
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Todos los campos son obligatorios"
  }
}
```

Esta prueba confirma el flujo:

```text
Postman
   |
   v
Express
   |
   v
auth.routes.js
   |
   v
auth.controller.js
```

La prueba de creación efectiva de usuarios se realizará una vez integrada la generación de `passwordHash`.

---

# Formato de errores

El contrato del Backend define el siguiente formato general:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "fields": {}
  }
}
```

El campo `fields` es opcional y puede utilizarse especialmente para errores de validación.

Códigos inicialmente definidos:

| Código | HTTP |
|---|---:|
| `VALIDATION_ERROR` | 400 |
| `INVALID_CREDENTIALS` | 401 |
| `INVALID_TOKEN` | 401 |
| `TOKEN_EXPIRED` | 401 |
| `FORBIDDEN` | 403 |
| `PRODUCT_NOT_FOUND` | 404 |
| `ORDER_NOT_FOUND` | 404 |
| `EMAIL_ALREADY_EXISTS` | 409 |
| `INSUFFICIENT_STOCK` | 409 |

---

# CORS

Durante desarrollo, el Backend permite solicitudes provenientes del Frontend local:

```text
http://localhost:5173
```

Headers permitidos:

```text
Content-Type
Authorization
```

Métodos configurados:

```text
GET
POST
PUT
DELETE
```

---

# Endpoints del MVP

El contrato actual contempla los siguientes grupos principales:

```text
/api/auth
/api/categories
/api/products
/api/orders
```

Su implementación se realizará progresivamente según las tarjetas asignadas al equipo Backend.

---

# Seguridad

Reglas generales definidas para el Backend:

- Las contraseñas nunca deben almacenarse en texto plano.
- Las credenciales y secretos deben almacenarse en variables de entorno.
- `.env` no debe versionarse.
- Los usuarios registrados públicamente reciben rol `CLIENT`.
- Los endpoints protegidos utilizarán JWT.
- La duración prevista del JWT es de 8 horas.
- No se utilizará refresh token en el MVP.
- Un token inválido o expirado debe producir `401`.
- Un usuario autenticado sin permisos suficientes debe recibir `403`.

---

# Integración con Frontend

Durante desarrollo:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
API Base: http://localhost:3000/api
```

El Frontend debe consumir la API utilizando `/api` como prefijo de los endpoints.

---

# Estado del proyecto

NovaMarket se encuentra actualmente en desarrollo.

La implementación del Backend se realiza progresivamente de acuerdo con las tareas asignadas en cada Sprint.

Las funcionalidades documentadas como **pendientes** representan decisiones acordadas para el MVP, pero no deben interpretarse como funcionalidades ya implementadas.

La documentación deberá actualizarse a medida que se integren nuevas funcionalidades, endpoints y reglas de negocio.