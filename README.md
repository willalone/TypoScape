# TypoScape

[![CI](https://github.com/willalone/TypoScape/actions/workflows/ci.yml/badge.svg)](https://github.com/willalone/TypoScape/actions/workflows/ci.yml)

**Live demo:** [https://willalone.github.io/TypoScape/](https://willalone.github.io/TypoScape/)

Интерактивная 3D-типографика на Vue 3 и Three.js. Объёмные буквы **TYPO** с металлическим материалом: наведи курсор — подсветка, кликни — буква взлетает и возвращается.

![TypoScape preview](docs/preview.svg)

## Технологии

| Инструмент | Назначение |
|------------|------------|
| Vue 3 + Composition API | UI и интеграция с canvas |
| Three.js + TextGeometry | Объёмные 3D-буквы с фасками |
| GSAP | Hover и click-анимации |
| Pinia | Состояние сцены |
| Vite | Сборка |
| Docker + GitHub Actions | Деплой |

## Возможности

- Полноэкранная 3D-сцена с орбитальной камерой
- Объёмные буквы (`TextGeometry` + `FontLoader`)
- Hover: масштаб +18% и emissive-подсветка
- Click: анимация взлёта с возвратом
- Частицы и референсная сетка
- Авто-вращение камеры (`Space` или кнопка)

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

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Локальная разработка |
| `npm run build` | Production-сборка |
| `npm run preview` | Просмотр сборки |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

## Деплой на GitHub Pages

1. **Settings → Pages** → Source: **GitHub Actions**
2. Запушьте в `main`

Демо: **https://willalone.github.io/TypoScape/**

## Управление

| Действие | Управление |
|----------|------------|
| Вращение камеры | ЛКМ + перетаскивание |
| Приближение | Колёсико мыши |
| Авто-вращение | `Space` или кнопка в UI |
| Сброс камеры | Кнопка «Сбросить камеру» |

## Лицензия

MIT
