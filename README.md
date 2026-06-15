# TypoScape

[![CI](https://github.com/willalone/TypoScape/actions/workflows/ci.yml/badge.svg)](https://github.com/willalone/TypoScape/actions/workflows/ci.yml)

**Live demo:** [https://willalone.github.io/TypoScape/](https://willalone.github.io/TypoScape/)

Интерактивная 3D-типографика — портфолио-проект на Vue 3 и Three.js. Объёмные буквы **TYPO** с металлическим материалом, bloom и живым фоном: наведи курсор — подсветка, кликни — буква взлетает и возвращается.

![TypoScape preview](docs/preview.svg)

## Технологии

| Инструмент | Назначение |
|------------|------------|
| **Vue 3 + Composition API** | UI и интеграция с canvas |
| **Three.js + TextGeometry** | Объёмные 3D-буквы с фасками |
| **GSAP** | Hover и click-анимации |
| **Post-processing** | Bloom, vignette, film grain |
| **Pinia** | Состояние сцены и загрузки |
| **Vite** | Сборка и dev-сервер |
| **Docker + GitHub Actions** | Деплой |

### Шрифт

**Helvetiker Bold** — геометрический гротеск в духе швейцарской школы. В 3D с фасками даёт читаемый объём и выразительный силуэт.

## Возможности

- Полноэкранная 3D-сцена с орбитальной камерой
- Объёмные буквы (`TextGeometry` + `FontLoader`)
- Металлический `MeshPhysicalMaterial` с emissive-подсветкой
- Post-processing: bloom, vignette, film grain
- Анимированный градиентный фон и абстрактная геометрия
- Экран загрузки с прогрессом
- Авто-вращение камеры (`Space` или кнопка)
- Fallback только при реальной ошибке WebGL
- Адаптивность от 1280×720 до 4K

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

### Docker

```bash
docker compose up --build
```

Приложение будет доступно на [http://localhost:8080](http://localhost:8080).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Локальная разработка |
| `npm run build` | Production-сборка |
| `npm run preview` | Просмотр сборки |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run format` | Prettier |

## Деплой на GitHub Pages

1. **Settings → Pages** → Source: **GitHub Actions**
2. Запушьте в `main` или запустите **Actions → CI → Run workflow**

Демо: **https://willalone.github.io/TypoScape/**

## Управление

| Действие | Управление |
|----------|------------|
| Вращение камеры | ЛКМ + перетаскивание |
| Приближение | Колёсико мыши |
| Авто-вращение | `Space` или кнопка в UI |
| Сброс камеры | Кнопка «Сбросить камеру» |
| Интерактив с буквами | Наведение и клик |

## Лицензия

MIT
