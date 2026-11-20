# NovaMarket — Backend

API REST del MVP de comercio electrónico **NovaMarket**, desarrollada por el equipo Backend del grupo **S2621 — Talently Lab**.

> **Corte de documentación:** 20/11/2026. Basado en el código integrado en `develop` revisado para la entrega. La existencia de una funcionalidad en el código no implica que se haya completado una prueba integral de extremo a extremo.

## Tecnologías

- Node.js (requisito documentado: 20.19+), JavaScript con módulos ES.
- Express 5, MongoDB y Mongoose 9.
- `bcrypt` para hash y verificación de contraseñas.
- `jsonwebtoken` para autenticación JWT.
- `helmet` para encabezados HTTP de seguridad.
- `cors` para controlar orígenes permitidos.
- `dotenv` para variables de entorno y `nodemon` para desarrollo.

Las versiones exactas de dependencias están en `package.json` y `package-lock.json`.

## Funcionalidades implementadas

- Registro, inicio de sesión y consulta del usuario autenticado.
- Roles `CLIENT` y `ADMIN`, con autenticación y autorización en rutas protegidas.
- Catálogo de productos, búsqueda, filtros, paginación y detalle.
- Listado de categorías activas.
- Administración de productos: alta, actualización y baja lógica (solo `ADMIN`).
- Creación y consulta de pedidos, con acceso restringido según rol y propietario.
- Validación de disponibilidad al crear pedidos.
- Servicio independiente de descuento atómico de stock.
- Endpoint de estado del servidor (`health`).

### Alcance y limitaciones conocidas

- **El descuento de stock todavía no está conectado al flujo de creación de pedidos** en el código revisado: `orders.controller.js` valida disponibilidad y crea la orden, pero no invoca `decrementStock`. El servicio `stock.service.js` existe y efectúa un decremento atómico condicionado a disponibilidad.
- La respuesta actual de pedidos incluye productos, importes, estado y fecha; **no incluye los datos del cliente en el objeto de respuesta**. Esta mejora debe verificarse nuevamente cuando se integre el trabajo correspondiente.
- `GET /api/products` utiliza autenticación opcional: sin token permite el acceso público, pero con un token malformado, inválido o vencido puede responder `401`. Es un comportamiento conocido a considerar en pruebas de integración.
- La mejora de validación de registro, limitación de intentos y refuerzo de JWT se encuentra en el **PR #34**, que estaba abierto en la revisión previa a la entrega; no se presenta aquí como integrada.
- No se identificó una suite automatizada de pruebas en los scripts de `package.json`; las comprobaciones funcionales documentadas no equivalen a cobertura automatizada.

## Arquitectura

```text
Frontend (React / Vite)
       |
       | HTTP / JSON
       v
Express API (/api)
       |
       +-- routes -> middlewares -> controllers
       |                          |
       |                          +-- models (Mongoose)
       |                          +-- services
       v
MongoDB
```

### Estructura del código

```text
backend/
├── src/
│   ├── app.js                   # Express, Helmet, CORS y rutas
│   ├── server.js                # Carga de entorno, conexión DB y servidor
│   ├── config/db.js             # Conexión MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── categories.controller.js
│   │   ├── orders.controller.js
│   │   └── products.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── optionalAuth.middleware.js
│   │   └── roles.middleware.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── categories.routes.js
│   │   ├── orders.routes.js
│   │   └── products.routes.js
│   ├── services/stock.service.js
│   └── utils/
│       ├── apiError.js
│       └── password.js
├── .env.example
├── package.json
└── package-lock.json
```

## Instalación local

Desde la raíz del repositorio:

```bash
cd backend
npm ci
```

Crear `backend/.env` tomando como referencia `backend/.env.example`:

```dotenv
PORT=3000
MONGODB_URI=<cadena_de_conexion_mongodb>
JWT_SECRET=<secreto_largo_y_aleatorio>
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173
```

No subir `.env` al repositorio ni compartir secretos o cadenas de conexión.

Iniciar en desarrollo:

```bash
npm run dev
```

O iniciar sin recarga automática:

```bash
npm start
```

El servidor conecta primero a MongoDB y luego escucha en el puerto configurado (por defecto `3000`).

### Comprobación de salud

```http
GET http://localhost:3000/api/health
```

Respuesta esperada (`200`):

```json
{
  "status": "ok",
  "message": "NovaMarket API funcionando"
}
```

> El endpoint `health` comprueba que Express responde; por sí solo no constituye una prueba completa de las operaciones de base de datos.

## Endpoints

Prefijo general: `/api`. Los endpoints protegidos requieren `Authorization: Bearer <token>`.

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | Público | Estado de la API |
| `POST` | `/api/auth/register` | Público | Registrar usuario |
| `POST` | `/api/auth/login` | Público | Iniciar sesión y recibir JWT |
| `GET` | `/api/auth/me` | Autenticado | Consultar usuario actual |
| `GET` | `/api/categories` | Público | Listar categorías activas |
| `GET` | `/api/products` | Público / ADMIN para inactivos | Catálogo con filtros |
| `GET` | `/api/products/:id` | Público | Detalle de producto |
| `POST` | `/api/products` | ADMIN | Crear producto |
| `PUT` | `/api/products/:id` | ADMIN | Actualizar producto completo |
| `DELETE` | `/api/products/:id` | ADMIN | Dar de baja un producto (baja lógica) |
| `POST` | `/api/orders` | CLIENT | Crear pedido |
| `GET` | `/api/orders` | CLIENT / ADMIN | CLIENT: propios; ADMIN: todos |
| `GET` | `/api/orders/:id` | CLIENT / ADMIN | CLIENT: propio; ADMIN: cualquiera |

### Registro y autenticación

Ejemplo de registro:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "ClaveSegura123"
}
```

Las contraseñas se almacenan como `passwordHash` mediante `bcrypt`, no en texto plano. El registro público crea usuarios con rol `CLIENT` por defecto. El login entrega un JWT que contiene el identificador y rol del usuario, con duración configurable mediante `JWT_EXPIRES_IN` (valor por defecto: `8h`).

### Catálogo

`GET /api/products` admite `page`, `limit`, `search`, `category`, `featured`, `offer` y `active`. La paginación usa por defecto página `1` y límite `12`, con máximo de `50` resultados por página.

- Por defecto se consultan productos activos.
- `active=false` y `active=all` requieren rol `ADMIN`.
- La actualización `PUT` requiere los datos completos del producto; no es un `PATCH` parcial.
- `DELETE` realiza una baja lógica (`active=false`), no elimina físicamente el documento.
- Las imágenes se almacenan como referencias de URL en el producto; no se documenta un endpoint de carga de archivos en este Backend.

### Pedidos

Ejemplo de creación:

```http
POST /api/orders
Authorization: Bearer <token_de_cliente>
Content-Type: application/json
```

```json
{
  "items": [
    { "productId": "<id_de_producto>", "quantity": 2 }
  ]
}
```

El servidor verifica IDs, cantidades enteras positivas, ausencia de productos duplicados, existencia, estado activo y stock disponible. Obtiene el precio vigente desde la base de datos y calcula subtotales y total; no confía en importes enviados por el cliente. La orden se crea con estado `CREATED` y queda asociada al usuario autenticado.

**Importante:** en la versión revisada, la creación de la orden no ejecuta el descuento de stock. `decrementStock(productId, quantity, session?)` es un servicio disponible para su integración posterior.

## Seguridad y manejo de errores

- `helmet()` aplica encabezados HTTP de seguridad.
- CORS utiliza `CORS_ORIGIN` (por defecto `http://localhost:5173`).
- Las rutas privadas verifican JWT; las operaciones administrativas requieren `ADMIN`.
- Los errores siguen una estructura JSON común:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descripción del error",
    "fields": {}
  }
}
```

`fields` es opcional. Entre los códigos utilizados se encuentran `VALIDATION_ERROR` (400), `INVALID_CREDENTIALS` (401), `INVALID_TOKEN` (401), `TOKEN_EXPIRED` (401), `FORBIDDEN` (403), `PRODUCT_NOT_FOUND` (404), `ORDER_NOT_FOUND` (404), `EMAIL_ALREADY_EXISTS` (409) e `INSUFFICIENT_STOCK` (409).

## Verificación manual sugerida antes de la entrega

1. Iniciar la API y comprobar `GET /api/health`.
2. Consultar categorías y catálogo sin autenticación.
3. Registrar un usuario de prueba, iniciar sesión y consultar `/api/auth/me.
4. Comprobar que un CLIENT no pueda administrar productos.
5. Crear una orden de prueba con un CLIENT y consultar sus pedidos.
6. Comprobar que un CLIENT no pueda consultar pedidos ajenos y que ADMIN tenga acceso autorizado.
7. Verificar el comportamiento ante stock insuficiente y token inválido.
8. Verificar el despliegue web y la comunicación Frontend–Backend.

No ejecutar escrituras sobre datos de producción durante la presentación sin coordinación con el equipo.

## Estado de entrega

Esta documentación describe el código Backend revisado en `develop` para el MVP. Antes de cerrar el release, confirmar los PR abiertos y actualizar esta sección si se integran cambios en pedidos, stock, autenticación o datos del cliente.
