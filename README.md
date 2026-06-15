# TypoScape

[![CI](https://github.com/willalone/TypoScape/actions/workflows/ci.yml/badge.svg)](https://github.com/willalone/TypoScape/actions/workflows/ci.yml)

**Live demo:** [https://willalone.github.io/TypoScape/](https://willalone.github.io/TypoScape/)

Интерактивная 3D-типографика — объёмное слово **TYPO** в тёмном пространстве.

![TypoScape preview](https://willalone.github.io/TypoScape/docs/preview.svg)

## Исходный код (точки входа)

| Файл | Назначение |
| --- | --- |
| [src/app/useAppShell.ts](https://github.com/willalone/TypoScape/blob/main/src/app/useAppShell.ts) | Логика корневого layout |
| [src/components/useTypoScene.ts](https://github.com/willalone/TypoScape/blob/main/src/components/useTypoScene.ts) | Инициализация WebGL-сцены |
| [src/three/TypoSceneController.ts](https://github.com/willalone/TypoScape/blob/main/src/three/TypoSceneController.ts) | Three.js: сцена, свет, анимации |
| [src/three/createLetters.ts](https://github.com/willalone/TypoScape/blob/main/src/three/createLetters.ts) | Геометрия букв TYPO |
| [src/three/animations.ts](https://github.com/willalone/TypoScape/blob/main/src/three/animations.ts) | GSAP: hover, click, intro |

Файлы `.vue` — тонкие обёртки над TypeScript-модулями выше. Если GitHub UI показывает `.vue` пустым, откройте **Raw** или таблицу выше.

## Что реализовано

- 3D-буквы TYPO (Three.js TextGeometry) с emissive-подсветкой и ореолом
- Intro-анимация появления + прогресс-бар загрузки
- Hover / click с GSAP-анимациями
- Звук при наведении и клике (переключатель в UI)
- Карточка с метаданными буквы при клике
- Адаптивная камера для мобильных
- Bloom post-processing
- Статическое превью, если WebGL недоступен (headless / старые браузеры)

## Технологии

Vue 3 · TypeScript · Three.js · GSAP · Pinia · Vite · Docker · GitHub Actions

## Быстрый старт

```bash
npm install
npm run dev
```

Сборка для GitHub Pages (с проверкой ассетов):

```bash
npm run build:pages
npm run preview -- --base /TypoScape/
```

### Docker

```bash
docker compose up --build
```

## Деплой

1. **Settings → Pages** → Source: **GitHub Actions**
2. Push в `main` — CI соберёт, проверит `dist/` и задеплоит

## Лицензия

MIT
