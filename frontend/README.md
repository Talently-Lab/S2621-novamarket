# NovaMarket — Frontend

Frontend del MVP de NovaMarket, un e-commerce. Esta aplicación consume la API del backend (carpeta `/backend` del monorepo).

## Stack

| Herramienta      | Versión |
| ---------------- | ------- |
| React            | 18.3    |
| Vite             | 8.3     |
| Tailwind CSS     | 3.4     |
| React Router DOM | 6.30    |
| Axios            | 1.20    |
| lucide-react     | 1.47    |
| ESLint           | 10      |
| Prettier         | 3.9     |

Lenguaje: JavaScript (sin TypeScript). Estado global: Context API.

## Cómo correrlo

Requisitos: Node.js 20.19+ y npm.

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Otros scripts:

- `npm run build`: genera el build de producción en `dist/`.
- `npm run preview`: sirve el build localmente.
- `npm run lint`: corre ESLint.
- `npm run format`: formatea el código con Prettier.

## Variables de entorno

| Variable       | Descripción        | Ejemplo                     |
| -------------- | ------------------ | --------------------------- |
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api` |

## Estructura de carpetas

```
src/
├── assets/      # Imágenes, íconos y archivos estáticos
├── components/  # Componentes reutilizables de UI
├── context/     # Contextos globales (Context API)
├── hooks/       # Custom hooks
├── pages/       # Una vista por ruta (Home, Products, Cart, etc.)
├── routes/      # Definición de rutas (AppRouter)
└── services/    # Cliente HTTP (Axios) y llamadas a la API
```

## Arquitectura de componentes

Esta sección define cómo se organiza el frontend: carpetas, rutas, componentes reutilizables, manejo de estado y capa de servicios. Es la referencia para implementar las pantallas definidas por UX (Home, Catálogo, Detalle de producto, Carrito, Checkout, Login, Registro, Admin y Not Found), cada una en desktop (1440), tablet (768) y mobile (375).

Lo que depende de wireframes que todavía no están dibujados queda marcado como **a validar con UX** y se resume en [Pendientes](#pendientes).

### Carpetas y responsabilidades

Organización interna prevista para la [estructura de carpetas](#estructura-de-carpetas):

```
src/
├── assets/        # Imágenes e íconos estáticos
├── components/    # Componentes reutilizables, agrupados por dominio
│   ├── ui/        # Button, Input, Loader, ErrorMessage, EmptyState, Pagination, QuantitySelector
│   ├── layout/    # Layout, Navbar, Footer
│   ├── product/   # ProductCard, ProductGrid, ProductImage, SearchBar, CategoryFilter
│   ├── cart/      # CartItem, CartSummary
│   └── admin/     # ProductForm, ProductTable, OrderTable
├── context/       # AuthContext.js, AuthProvider.jsx, CartContext.js, CartProvider.jsx
├── hooks/         # useAuth, useCart, useProducts, useProduct, useCategories, useOrder, useOrders
├── pages/         # Una página por ruta (se agrega OrderConfirmation, a validar con UX)
├── routes/        # AppRouter, ProtectedRoute, AdminRoute
└── services/      # api.js, authService, productService, categoryService, orderService
```

| Carpeta       | Qué va                                                                                                                    | Regla                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | Piezas de UI reutilizables y bloques grandes que conviene aislar de la página (como el formulario y las tablas de Admin). | No llaman a la API: reciben los datos por props. Solo leen contexto (`useAuth`, `useCart`) cuando necesitan la sesión o el carrito. |
| `pages/`      | Una vista completa por ruta.                                                                                              | Piden los datos (a través de hooks), manejan los filtros y estados de la vista y arman la pantalla con los componentes.             |
| `services/`   | La instancia de Axios y un módulo por recurso de la API.                                                                  | Único lugar que conoce Axios y las URLs. Cada función devuelve `response.data`.                                                     |
| `context/`    | Estado global con Context API.                                                                                            | Solo sesión (`AuthContext`) y carrito (`CartContext`).                                                                              |
| `hooks/`      | Custom hooks: acceso a los contextos y pedido de datos.                                                                   | Los hooks de datos devuelven `{ data, loading, error, refetch }`.                                                                   |
| `routes/`     | Definición de rutas y guards de acceso.                                                                                   | Solo navegación y control de acceso.                                                                                                |
| `assets/`     | Archivos estáticos que se importan desde el código.                                                                       | —                                                                                                                                   |

Convenciones:

- Un componente por archivo, en PascalCase y con `export default`, igual que las páginas actuales (`components/ui/Button.jsx`).
- Hooks en camelCase con prefijo `use` (`hooks/useProducts.js`) y servicios con sufijo `Service` (`services/productService.js`).
- Cada contexto se reparte en tres archivos: el objeto de contexto (`context/AuthContext.js`), el Provider (`context/AuthProvider.jsx`) y el hook de acceso (`hooks/useAuth.js`). La regla `react-refresh/only-export-components` de ESLint da error si un `.jsx` exporta el Provider junto con el contexto o con el hook.
- Estilos con Tailwind, mobile-first: la base es mobile (375), `md:` es tablet (768) y `lg:` es desktop (diseños en 1440). Los íconos salen de `lucide-react`.
- Las subcarpetas y los archivos que se nombran en esta sección se crean a medida que se implementa cada pieza; mientras tanto `components/`, `context/` y `hooks/` se mantienen con `.gitkeep`.

### Páginas y rutas

`routes/AppRouter.jsx` ya declara las rutas de las pantallas de UX con páginas placeholder. Todas se renderizan dentro de `Layout` (`Navbar` + contenido + `Footer`) y las que requieren sesión se anidan dentro de los guards, que funcionan como rutas de layout con `<Outlet />`:

```jsx
<Route element={<Layout />}>
  <Route path="/" element={<Home />} />
  {/* ...resto de las rutas públicas */}
  <Route element={<ProtectedRoute />}>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/orders/:id" element={<OrderConfirmation />} />
  </Route>
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<Admin />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Route>
```

| Ruta            | Página              | Pantalla UX         | Acceso                                  | Contenido                                                                                                                       |
| --------------- | ------------------- | ------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `/`             | `Home`              | Home                | Público                                 | Presentación y selección de productos (`ProductGrid`). **A validar con UX.**                                                    |
| `/products`     | `Products`          | Catálogo            | Público                                 | `SearchBar`, `CategoryFilter`, `ProductGrid` y `Pagination`.                                                                    |
| `/products/:id` | `ProductDetail`     | Detalle de producto | Público                                 | `ProductImage`, datos del producto, `QuantitySelector` y botón "Agregar al carrito".                                            |
| `/cart`         | `Cart`              | Carrito             | Público                                 | Un `CartItem` por producto y `CartSummary`; `EmptyState` si el carrito está vacío.                                              |
| `/checkout`     | `Checkout`          | Checkout            | Autenticado                             | Ítems en modo lectura, `CartSummary` y botón "Confirmar compra" (`POST /api/orders`).                                           |
| `/orders/:id`   | `OrderConfirmation` | Sin wireframe       | Autenticado (dueño de la orden o admin) | Detalle de la orden creada (`GET /api/orders/:id`). **A validar con UX.**                                                       |
| `/login`        | `Login`             | Login               | Público                                 | Formulario de ingreso.                                                                                                          |
| `/register`     | `Register`          | Registro            | Público                                 | Formulario de registro; al terminar redirige a `/login`.                                                                        |
| `/admin`        | `Admin`             | Admin               | Admin                                   | Productos (`ProductTable` y `ProductForm`: alta, edición y baja lógica) y listado de órdenes (`OrderTable`, `GET /api/orders`). |
| `*`             | `NotFound`          | Not Found           | Público                                 | Aviso de página inexistente y enlace al inicio.                                                                                 |

Comportamiento de los guards:

- `ProtectedRoute`: sin sesión, redirige a `/login` y guarda la ruta de origen para volver a ella después de ingresar (por ejemplo, `/checkout`).
- `AdminRoute`: exige sesión y rol `admin`; un usuario con rol `client` vuelve a `/`.
- Mientras se revalida la sesión al recargar (`GET /api/auth/me`), ambos muestran `Loader` en lugar de redirigir, para no enviar al login a alguien con una sesión válida.

### Componentes reutilizables

Los estados de carga, error y vacío se resuelven siempre con `Loader`, `ErrorMessage` y `EmptyState`, para que se vean igual en todas las pantallas. En la tabla, "—" indica que no aplica; en la última columna significa que el componente no maneja estado propio.

| Componente         | Carpeta              | Props principales                                                                                  | Estados (loading / error / vacío)                                                                    | Estado local / global                                              |
| ------------------ | -------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `Button`           | `components/ui`      | `children`, `variant` (`primary`, `secondary`, `danger`), `type`, `disabled`, `loading`, `onClick` | loading: spinner y botón deshabilitado                                                               | —                                                                  |
| `Input`            | `components/ui`      | `label`, `name`, `type`, `value`, `onChange`, `error`, `required`, `placeholder`                   | error: mensaje debajo del campo                                                                      | — (controlado por el formulario)                                   |
| `Loader`           | `components/ui`      | `label` (texto accesible), `size`                                                                  | Representa el estado loading                                                                         | —                                                                  |
| `ErrorMessage`     | `components/ui`      | `message`, `onRetry` (opcional), `action` (opcional: enlace o botón)                               | Representa el estado error; muestra "Reintentar" si recibe `onRetry`                                 | —                                                                  |
| `EmptyState`       | `components/ui`      | `title`, `description`, `action` (opcional)                                                        | Representa el estado vacío                                                                           | —                                                                  |
| `Pagination`       | `components/ui`      | `page`, `totalPages` (de `pagination`), `onPageChange`                                             | No se muestra si hay una sola página; "Anterior" y "Siguiente" se deshabilitan en los extremos       | — (la página actual vive en la vista)                              |
| `QuantitySelector` | `components/ui`      | `value`, `min`, `max` (el `stock`), `onChange`, `disabled`                                         | Botones deshabilitados en los límites                                                                | —                                                                  |
| `Layout`           | `components/layout`  | — (renderiza `<Outlet />`)                                                                         | —                                                                                                    | —                                                                  |
| `Navbar`           | `components/layout`  | —                                                                                                  | Sin sesión, con sesión (nombre del usuario y "Salir") y admin (enlace a Admin); contador del carrito | Global: `useAuth`, `useCart`. Local: menú mobile abierto o cerrado |
| `Footer`           | `components/layout`  | —                                                                                                  | —                                                                                                    | —                                                                  |
| `ProductCard`      | `components/product` | `product` (`id`, `name`, `price`, `imageUrl`, `stock`)                                             | Sin stock: etiqueta "Sin stock" y botón deshabilitado                                                | Global: `addItem` de `useCart`                                     |
| `ProductGrid`      | `components/product` | `products`, `loading`, `error`, `onRetry`, `emptyMessage`                                          | loading (`Loader`), error (`ErrorMessage`), vacío (`EmptyState`)                                     | —                                                                  |
| `ProductImage`     | `components/product` | `src` (`imageUrl`), `alt`, `className`                                                             | Placeholder si `src` es `null` o la imagen no carga                                                  | Local: error de carga de la imagen                                 |
| `SearchBar`        | `components/product` | `value`, `onSearch`, `placeholder`                                                                 | —                                                                                                    | Local: texto en edición; emite `onSearch` al enviar                |
| `CategoryFilter`   | `components/product` | `categories` (strings), `value`, `onChange`, `loading`, `error`                                    | loading (deshabilitado), error (aviso breve; el catálogo sigue usable)                               | —                                                                  |
| `CartItem`         | `components/cart`    | `item` (`productId`, `name`, `price`, `imageUrl`, `stock`, `quantity`), `readOnly`                 | —                                                                                                    | Global: `updateQuantity` y `removeItem` de `useCart`               |
| `CartSummary`      | `components/cart`    | `actionLabel`, `onAction`, `loading`, `disabled`                                                   | loading: mientras se crea la orden                                                                   | Global: `totalItems` y `subtotal` de `useCart`                     |
| `ProductForm`      | `components/admin`   | `product` (`null` para alta), `categories`, `onSubmit`, `onCancel`, `submitting`, `error`          | loading (envío), error (`ErrorMessage` y errores por campo)                                          | Local: valores y validación del formulario                         |
| `ProductTable`     | `components/admin`   | `products`, `loading`, `error`, `onRetry`, `onEdit`, `onDeactivate`                                | loading, error y vacío ("todavía no hay productos")                                                  | —                                                                  |
| `OrderTable`       | `components/admin`   | `orders`, `loading`, `error`, `onRetry`                                                            | loading, error y vacío ("todavía no hay órdenes")                                                    | —                                                                  |
| `ProtectedRoute`   | `routes`             | — (ruta de layout con `<Outlet />`)                                                                | loading: `Loader` mientras se revalida la sesión                                                     | Global: `useAuth`                                                  |
| `AdminRoute`       | `routes`             | — (ruta de layout con `<Outlet />`)                                                                | loading: `Loader` mientras se revalida la sesión                                                     | Global: `useAuth`                                                  |

Detalle de Admin:

- `ProductForm` edita los campos del contrato: `name`, `description`, `price`, `category` (una de las que devuelve `GET /api/categories`), `stock` e `imageUrl` (opcional: si queda vacío se envía `null`). Valida en el cliente los campos obligatorios y los valores numéricos, y además muestra los errores por campo que devuelve la API.
- `ProductTable` muestra imagen, nombre, categoría, precio, stock, estado (`active`) y las acciones Editar y Desactivar. Desactivar es la baja lógica y pide confirmación. Ver los productos inactivos depende de `BCK-PROD-01`.
- `OrderTable` lista las órdenes de `GET /api/orders`. Qué columnas muestra y si cada fila lleva al detalle (`/orders/:id`, que el admin también puede ver) queda a validar con UX.

### Estado global y local

Criterio: un dato va a contexto solo si lo usan varias pantallas no relacionadas y tiene que sobrevivir a la navegación. En este MVP eso es la sesión y el carrito; todo lo demás es estado local.

#### `AuthContext`

- **Guarda:** `user` (`id`, `name`, `email` y `role`, que es `client` o `admin`) y `loading` mientras se revalida la sesión. El token se persiste en `localStorage` para sobrevivir a la recarga, pero no se expone a los componentes: lo usa el interceptor de `api.js`.
- **Expone:** `user`, `isAuthenticated`, `isAdmin` (`user.role === 'admin'`), `loading`, `login(credentials)` y `logout()`.
- **Al iniciar la app:** si hay token, llama a `GET /api/auth/me`. Si responde OK carga `user`; si responde 401 se limpia la sesión.
- **Login:** `login(credentials)` llama a `authService.login`, que responde `{ token, user }`, y guarda los dos.
- **Registro:** no pasa por el contexto porque no crea sesión. `Register` llama a `authService.register` y redirige a `/login`.

#### `CartContext`

- **Guarda:** `items`, cada uno con `productId`, `name`, `price`, `imageUrl`, `stock` y `quantity` (lo necesario para mostrar el carrito sin volver a pedir los productos). El carrito es anónimo y solo vive en el navegador: se persiste en `localStorage` y el Back no lo guarda (sección 7 del contrato).
- **Expone:** `items`, `totalItems` (contador del `Navbar`), `subtotal` (estimado), `addItem(product, quantity)`, `updateQuantity(productId, quantity)`, `removeItem(productId)` y `clearCart()`.
- `totalItems` y `subtotal` se calculan a partir de `items`; no se guardan por separado.
- `addItem` rechaza productos con `stock` 0 y ninguna cantidad puede superar el `stock` del producto.

`AuthProvider` y `CartProvider` envuelven las rutas dentro de `BrowserRouter`, porque `AuthProvider` necesita navegar a `/login` cuando se limpia la sesión.

#### Estado local

| Qué                                                                | Dónde vive                                                                                   | Por qué no es global                                                            |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Formularios (login, registro, producto en Admin)                   | El componente del formulario (`useState`)                                                    | Solo importa mientras se completa y se descarta al enviar o salir.              |
| Búsqueda, categoría y página del catálogo                          | La página `Products`, reflejada en la URL (`?search=&category=&page=`) con `useSearchParams` | Solo los usa el catálogo; en la URL se mantienen al recargar y al volver atrás. |
| Datos remotos y estado de cada pedido (`data`, `loading`, `error`) | Los hooks de datos que usa cada página                                                       | Cada vista pide lo que muestra; el MVP no necesita una caché compartida.        |
| UI (menú mobile, formulario abierto en Admin, confirmaciones)      | El componente que lo usa                                                                     | Ninguna otra parte de la app lo necesita.                                       |

Mantener este estado local evita re-renderizar toda la app por cambios que afectan a una sola vista y deja los contextos acotados y predecibles.

Hooks de datos previstos: `useProducts({ page, limit, search, category })` (Home y Catálogo), `useProduct(id)` (Detalle de producto), `useCategories()` (Catálogo y Admin), `useOrder(id)` (confirmación de orden) y `useOrders()` (órdenes en Admin).

### Capa de servicios

La capa de servicios sigue el **Contrato API v0.2** publicado por Back: endpoints, accesos, respuestas y códigos de error salen de ahí. Toda la comunicación con la API pasa por `services/`; páginas y componentes nunca importan `axios` directamente.

- **Instancia única:** `services/api.js` (ya existe) crea la instancia con `baseURL: import.meta.env.VITE_API_URL`. En local la API corre en el puerto 3000 (`http://localhost:3000/api`) y Vite en el 5173.
- **Token:** un interceptor de request agrega `Authorization: Bearer <token>` cuando hay token guardado, que es lo que piden los endpoints protegidos.
- **401:** como no hay refresh token, un interceptor de response limpia la sesión (token y `user`) ante cualquier 401 y redirige a `/login`. Para eso `api.js` expone `setUnauthorizedHandler`, donde `AuthProvider` registra la limpieza; así el contexto se actualiza sin recargar la página. Excepción: con credenciales inválidas, `POST /api/auth/login` responde 401 con un mensaje genérico (`INVALID_CREDENTIALS`); ese 401 no redirige y el mensaje se muestra en el formulario.
- **Errores:** el mismo interceptor normaliza todos los errores con `getApiError` (en `api.js`) antes de rechazar la promesa, así las vistas siempre reciben `{ code, message, fields }`.

La API responde los errores con el formato `{ error: { code, message, fields? } }`. `getApiError` lo traduce así:

| Caso                                                              | Resultado                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| La API respondió con ese formato                                  | `code`, `message` y `fields` de la respuesta (`fields` vacío si no viene) |
| La API respondió sin ese formato (por ejemplo, un 500 inesperado) | Mensaje genérico de error                                                 |
| No hubo respuesta (API caída o sin conexión)                      | Mensaje genérico de conexión                                              |

Cómo llega a la UI:

- `message` → `ErrorMessage` de la vista o del formulario (error general).
- `fields` → error de cada `Input` según el nombre del campo, por ejemplo `<Input name="email" error={fieldErrors.email} />` ante un `VALIDATION_ERROR`. El error de un campo se borra cuando el usuario lo modifica. `fields` es opcional y su confirmación está pendiente (`BCK-API-01`): si no viene, el formulario muestra solo `message`.
- `code` → no se muestra. Los códigos del contrato son estables y en mayúsculas (`INVALID_CREDENTIALS`, `VALIDATION_ERROR`, `PRODUCT_NOT_FOUND`, `INSUFFICIENT_STOCK`, entre otros), así que la UI decide por `code` y nunca comparando el texto de `message`.

Endpoints del contrato. En el código se escriben sin `/api`, porque `VITE_API_URL` ya lo incluye (por ejemplo, `api.get('/products')`):

| Función                                                         | Endpoint                                       | Acceso                                            | Contrato v0.2                                                                                         |
| --------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `authService.register(data)`                                    | `POST /api/auth/register`                      | Público                                           | Devuelve el usuario sin token; la UI redirige a `/login`.                                             |
| `authService.login(credentials)`                                | `POST /api/auth/login`                         | Público                                           | `{ token, user: { id, name, email, role } }`. Con credenciales inválidas, 401 con mensaje genérico.   |
| `authService.getMe()`                                           | `GET /api/auth/me`                             | Autenticado                                       | Revalida la sesión al recargar.                                                                       |
| `productService.getProducts({ page, limit, search, category })` | `GET /api/products?page&limit&search&category` | Público                                           | `{ products: [], pagination: { page, limit, totalItems, totalPages } }`.                              |
| `productService.getProductById(id)`                             | `GET /api/products/:id`                        | Público                                           | 404 si no existe o no está disponible públicamente.                                                   |
| `productService.createProduct(data)`                            | `POST /api/products`                           | Admin                                             | Alta de producto.                                                                                     |
| `productService.updateProduct(id, data)`                        | `PUT /api/products/:id`                        | Admin                                             | Edición de producto.                                                                                  |
| `productService.deactivateProduct(id)`                          | `DELETE /api/products/:id`                     | Admin                                             | Baja lógica: `active = false`.                                                                        |
| `categoryService.getCategories()`                               | `GET /api/categories`                          | Público                                           | `{ categories: [] }`, lista de strings.                                                               |
| `orderService.createOrder(items)`                               | `POST /api/orders`                             | Autenticado («Client autenticado» según contrato) | Body `{ items: [{ productId, quantity }] }`. 201 con la orden creada; 409 si no hay stock suficiente. |
| `orderService.getOrders()`                                      | `GET /api/orders`                              | Admin                                             | Listado de órdenes.                                                                                   |
| `orderService.getOrderById(id)`                                 | `GET /api/orders/:id`                          | Autenticado (dueño de la orden o admin)           | 403 si la orden es de otro usuario; 404 si no existe.                                                 |

Mientras `BCK-API-02` no fije los valores por defecto ni el máximo de `page` y `limit`, `getProducts` envía siempre los dos.

### Reglas del contrato aplicadas en la UI

| Regla                                          | Cómo se aplica                                                                                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Producto con `stock` 0                         | `ProductCard` y `ProductDetail` muestran "Sin stock" y deshabilitan "Agregar al carrito". `CartContext` también lo bloquea y `QuantitySelector` nunca supera el `stock`.                                                         |
| `imageUrl` en `null`                           | `ProductImage` muestra un placeholder (ícono de `lucide-react`); también si la URL no carga.                                                                                                                                     |
| Producto inexistente o no disponible           | `GET /api/products/:id` responde 404 (`PRODUCT_NOT_FOUND`): `ProductDetail` muestra un `EmptyState` de producto no disponible con enlace al catálogo.                                                                            |
| Baja lógica (`active`)                         | El catálogo público muestra lo que devuelve la API (solo productos activos), sin filtrar en el front. En Admin la acción es "Desactivar", no "Eliminar": `DELETE /api/products/:id` pone `active = false`.                       |
| Carrito anónimo                                | Vive solo en el navegador (`CartContext` + `localStorage`) y el Back no lo persiste (sección 7 del contrato). Se usa sin sesión.                                                                                                 |
| Body de `POST /api/orders`                     | `{ items: [{ productId, quantity }] }`. Nunca se envían precios ni totales.                                                                                                                                                      |
| Orden creada (201)                             | Recién entonces se llama a `clearCart()` y se navega a `/orders/:id` con el id de la orden que devuelve la respuesta.                                                                                                            |
| Stock insuficiente (409, `INSUFFICIENT_STOCK`) | `Checkout` muestra el `message` de la API en `ErrorMessage`, no vacía el carrito y ofrece volver a `/cart` para ajustar las cantidades antes de reintentar. Ante cualquier otro error el carrito también queda intacto.          |
| Sin permiso (403)                              | `ErrorMessage` con el `message` de la API, sin "Reintentar" (el resultado no cambiaría) y con enlace al inicio. No cierra la sesión: eso solo lo hace el 401. Caso principal: `OrderConfirmation` con una orden de otro usuario. |
| Orden inexistente (404)                        | `OrderConfirmation` muestra un `EmptyState` de orden no encontrada con enlace al inicio.                                                                                                                                         |
| Precios y total                                | Los precios del carrito son informativos (los del producto al agregarlo). El total real lo calcula el Back y es el que se muestra en la confirmación.                                                                            |
| Registro sin token                             | Después de registrarse se redirige a `/login` para iniciar sesión.                                                                                                                                                               |
| Sesión sin refresh token                       | Se revalida al recargar con `GET /api/auth/me`; ante cualquier 401 se limpia la sesión y se va a `/login`.                                                                                                                       |

### Pendientes

**A validar con UX (wireframes)**

- Confirmación de orden (`/orders/:id`): no tiene wireframe. Propuesta: número de orden, ítems, total calculado por el Back y un enlace para seguir comprando.
- Checkout: el contrato de órdenes solo recibe `productId` y `quantity`, sin datos de envío ni de pago. Confirmar que la pantalla es un resumen con el botón "Confirmar compra".
- Home: qué productos muestra. El contrato no tiene productos destacados; propuesta: los primeros del catálogo y acceso por categoría.
- Catálogo: productos por página (`limit`, dentro del máximo que defina `BCK-API-02`) y columnas de la grilla en 1440, 768 y 375.
- `ProductCard`: si incluye "Agregar al carrito" o solo lleva al detalle.
- `SearchBar`: solo en el Catálogo o también en el `Navbar`.
- Admin: cómo se reparten productos y órdenes en la pantalla (pestañas o secciones), si el formulario de producto va en un modal, un panel o una página propia, qué columnas tiene el listado de órdenes y cómo se ven las tablas en mobile (375).
- Estados comunes: diseño del placeholder de imagen, del `Loader` (spinner o skeleton), de `ErrorMessage` y de `EmptyState`.
- Sesión: mensaje al volver a `/login` por un 401 (sesión vencida) y regreso a `/checkout` después de ingresar.

**Pregunta abierta: marca y especificaciones técnicas**

- El contrato de producto no incluye marca ni especificaciones técnicas. Hasta que se definan, `ProductDetail` muestra solo los campos del contrato (imagen, nombre, categoría, precio, stock y descripción). Si se agregan, impactan en `ProductDetail`, en `ProductForm` (Admin) y quizás en `ProductCard`; hay que definir con Back y UX si son campos fijos o una lista de especificaciones.

**Supuestos a confirmar con Back**

Puntos abiertos del Contrato API v0.2 que impactan en el front, más CORS, que el contrato no cubre:

| Código                          | Punto abierto                                                                                                                   | Impacto en el front                                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `BCK-PROD-01`                   | Consulta de Admin para ver productos inactivos.                                                                                 | Hasta que se defina, `ProductTable` usa `GET /api/products` y solo ve productos activos: un producto desactivado deja de aparecer en Admin. |
| `BCK-AUTH-01`                   | Política de contraseñas.                                                                                                        | Reglas de validación de `Register`. Mientras tanto, el front solo exige el campo y muestra los errores que devuelva la API.                 |
| `BCK-AUTH-03`                   | Duración del JWT.                                                                                                               | Define cada cuánto vence la sesión; al vencer, el 401 lleva a `/login`.                                                                     |
| `BCK-API-01`                    | Confirmación de `error.fields` (opcional).                                                                                      | Errores por campo en los formularios; si no viene, se muestra solo `message`.                                                               |
| `BCK-API-02`                    | Valores por defecto y máximo de `page` y `limit`.                                                                               | Tamaño de página del catálogo; mientras tanto, el front envía siempre los dos valores.                                                      |
| Sin código (a confirmar)        | `POST /api/orders` indica «Client autenticado»: confirmar si solo el rol `client` puede comprar o cualquier usuario con sesión. | El front no restringe por rol: exige sesión y muestra el error que devuelva la API (por ejemplo, 403).                                      |
| Sin código (fuera del contrato) | CORS para `http://localhost:5173`.                                                                                              | La API tiene que aceptar requests desde ese origen con el header `Authorization`, porque el front la llama directo en el puerto 3000.       |
