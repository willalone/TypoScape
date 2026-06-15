# TypoScape

[![CI](https://github.com/willalone/TypoScape/actions/workflows/ci.yml/badge.svg)](https://github.com/willalone/TypoScape/actions/workflows/ci.yml)

**Live demo:** [https://willalone.github.io/TypoScape/](https://willalone.github.io/TypoScape/)

Интерактивная типографика в трёхмерном пространстве — портфолио-проект на Vue 3 и Three.js. Буквы слова **TYPO** живут в тёмной сцене с частицами, bloom и мягким светом: наводишь курсор — буква подсвечивается, кликаешь — она взлетает и возвращается.

![TypoScape preview](docs/preview.svg)

## Почему так

| Технология | Зачем |
|------------|-------|
| **Vue 3 + Composition API** | Чистая интеграция UI и canvas без лишнего бойлерплейта |
| **Three.js** | Полный контроль над 3D-сценой, светом и материалами |
| **troika-three-text** | SDF-типографика: чёткие контуры, лёгкие меши, эталонная читаемость |
| **GSAP** | Плавные hover/click-анимации без рывков |
| **Post-processing** | Bloom, vignette, film grain — визуальная глубина |
| **Pinia** | Состояние камеры, загрузки и интерактивности |
| **Vite** | Быстрая разработка и оптимизированная сборка |
| **Docker** | Воспроизводимый деплой одной командой |
| **Vitest** | Тест жизненного цикла сцены |

### Шрифт

**Inter 700** — современный неогротеск с открытыми формами. В связке с `troika-three-text` (SDF-рендеринг) даёт печатное качество на любом расстоянии камеры — без «грязных» мешей `TextGeometry`.

## Возможности

- Полноэкранная 3D-сцена с орбитальной камерой
- SDF-буквы через `troika-three-text`
- Post-processing: bloom, vignette, film grain
- Hover: масштаб + цветовая подсветка
- Click: плавная анимация «взлёта» с возвратом
- Экран загрузки с прогрессом
- Авто-вращение камеры (`Space` или кнопка)
- Fallback для браузеров без WebGL
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

1. Откройте **Settings → Pages**: https://github.com/willalone/TypoScape/settings/pages
2. В **Build and deployment → Source** выберите **GitHub Actions**
3. Запушьте в `main` или запустите workflow вручную: **Actions → CI → Run workflow**

Демо: **https://willalone.github.io/TypoScape/**

## Управление

| Действие | Управление |
|----------|------------|
| Вращение камеры | ЛКМ + перетаскивание |
| Приближение | Колёсико мыши |
| Авто-вращение | `Space` или кнопка в UI |
| Сброс камеры | Кнопка «Сбросить камеру» |
| Интерактив с буквами | Наведение и клик |

## Возможные улучшения

- Загрузка пользовательского слова через UI
- Chromatic aberration и motion blur
- Звуковое сопровождение с кнопкой mute
- Переключение светлой/тёмной палитры

## Лицензия

MIT
