# S2621-novamarket

NovaMarket — E-commerce MVP · Grupo S2621 · Talently Lab

Monorepo: `/frontend` (React + Vite + Tailwind) y `/backend`.

## Calidad y hooks

Gates de calidad para mantener el repo limpio y evitar ida y vuelta en los PRs:

- **Pre-commit** (Husky + lint-staged): formatea y lintea solo los archivos que estás por commitear.
- **Pre-push** (Husky): corre `format:check` + `lint` + `build` del frontend antes de subir, solo si el push toca `frontend/`.
- **CI** (GitHub Actions): en cada PR a `develop`/`main` corre `format:check`, `lint` y `build`.

### Instalación

```bash
npm install                    # raíz: instala Husky + lint-staged y activa los hooks
cd frontend && npm install     # dependencias del frontend
```

Requiere Node 20.19 o superior (ver `.nvmrc`).
