# NovaMarket

Aplicación móvil multiplataforma desarrollada en **Kotlin Multiplatform (KMP)** y **Compose Multiplatform**. **NovaMarket** es el canal de venta online propio de una tienda de tecnología que busca centralizar y escalar su operación comercial más allá de las redes sociales y marketplaces tradicionales.

## Descripción

La aplicación permite a los usuarios explorar un catálogo de productos tecnológicos tanto en **Android** como en **iOS** compartiendo la lógica de negocio, red, navegación e interfaz de usuario. Se conecta a una API REST para obtener productos paginados, aplicar filtros dinámicos y consultar el detalle técnico y disponibilidad de stock en tiempo real.

## Características principales

- **Arquitectura Multiplataforma (Android / iOS):** Código compartido de UI, dominio y datos mediante Kotlin Multiplatform.
- **UI Declarativa con Compose Multiplatform:** Interfaz moderna construida con Material 3.
- **Navegación Multiplataforma:** Gestión de rutas con Jetpack Navigation 3 Multiplatform.
- **Consumo de API REST con Ktor:** Cliente HTTP multiplataforma con negociación de contenido JSON y manejo tipado de respuestas.
- **Inyección de Dependencias con Koin:** Configuración modular desacoplada por funcionalidad.
- **Arquitectura Clean + MVVM (Feature-First):** Separación estricta entre capas de presentación, dominio y datos.
- **Gestión de Estado Reactivo:** Uso de `StateFlow` y estados sellados (`Loading`, `Success`, `Empty`, `Error`) con soporte de paginación.
- **Carga Asíncrona de Imágenes:** Integración de Coil 3 conectado al cliente de red de Ktor.

## Tecnologías utilizadas

- **Kotlin Multiplatform (`2.4.20`):** Lógica de negocio y presentación compartida entre plataformas.
- **Compose Multiplatform (`1.12.1`) & Material 3:** Construcción de interfaces declarativas multiplataforma.
- **Navigation 3 Multiplatform (`1.1.1`):** Navegación estructurada entre pantallas.
- **Ktor Client (`3.5.0`):** Cliente HTTP con motores nativos (`OkHttp` en Android y `Darwin` en iOS), `ContentNegotiation` y `Logging`.
- **Kotlinx Serialization (`1.10.0`):** Serialización y deserialización de modelos JSON (`@Serializable`).
- **Koin (`4.1.1`):** Inyección de dependencias para ViewModels, repositorios y servicios de red.
- **Coil 3 (`3.0.0`):** Carga y caché de imágenes desde red mediante `coil-network-ktor3`.
- **Coroutines & StateFlow:** Programación asíncrona y flujo de datos unidireccional (UDF).

## Estructura del proyecto

```text
novamarket/
├── app/                        # Punto de entrada y configuración general de la app
├── core/                       # Componentes reutilizables, utilidades y wrappers de red
├── feature/
│   ├── authentication/         # Flujo de inicio de sesión y registro de usuarios
│   └── home/                   # Catálogo principal y detalle de productos
│       ├── data/
│       │   ├── dto/            # Modelos de transferencia de datos (@Serializable)
│       │   ├── mapper/         # Conversión de DTOs a modelos de dominio
│       │   ├── remote/         # Definición de endpoints con Ktor (ProductApi)
│       │   └── repository/     # Implementación de repositorios (ProductRepositoryImp)
│       ├── di/                 # Módulos de inyección de dependencias con Koin
│       ├── domain/
│       │   ├── model/          # Entidades puras de negocio (Product, Category, ProductsPage)
│       │   └── repository/     # Contratos e interfaces de repositorio
│       └── presentation/
│           ├── components/     # Componentes UI reutilizables de la feature
│           ├── content/        # Contenedores y layouts de pantalla
│           ├── screen/         # Pantallas principales (Home, Listado, Detalle)
│           └── viewmodels/     # ViewModels y estados de UI (ProductListViewModel, etc.)
└── navigation/                 # Configuración de rutas y grafo de navegación
```

## Arquitectura

El proyecto implementa **Clean Architecture** junto con **MVVM**:

- **Presentation Layer:** Pantallas en Compose Multiplatform que observan de forma reactiva los `StateFlow` expuestos por los `ViewModel`.
- **Domain Layer:** Modelos de negocio independientes del framework (`Product`, `Pagination`) e interfaces (`ProductRepository`) que definen los contratos de datos.
- **Data Layer:** Consumo de servicios remotos mediante `ProductApi` (Ktor), mapeo desacoplado con `ProductMapper` e implementación de repositorios con manejo centralizado de errores de red y serialización.

## Requisitos

- **Android Studio** (versión compatible con AGP `9.1.1` y Kotlin `2.4.20`)
- **JDK 11** o superior
- **Kotlin Multiplatform Plugin**
- **Xcode** y **macOS** (requeridos para compilar y ejecutar el framework `Shared` en iOS)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Abre el proyecto en **Android Studio**.
3. Verifica la configuración de la URL base (`BASE_URL`) de la API en la capa de red.
4. Sincroniza los archivos de Gradle y descarga las dependencias.
5. **Para Android:** Selecciona un emulador o dispositivo físico (API 24+) y ejecuta la aplicación.
6. **Para iOS:** Abre el proyecto de iOS en **Xcode** (o ejecuta la configuración de iOS desde Android Studio en macOS) y lánzalo en el simulador.

## Funcionalidades

- ✅ Listado paginado de productos tecnológicos
- ✅ Filtrado por categorías, productos destacados y ofertas
- ✅ Visualización de detalle de producto (precios regulares y promocionales, marca, stock disponible, galería de imágenes y especificaciones técnicas)
- ✅ Módulo de autenticación de usuarios
- ✅ Manejo de estados de carga, listas vacías y errores de conexión
