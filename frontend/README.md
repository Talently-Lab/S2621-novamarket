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
