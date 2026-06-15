# TypoScape

[![CI](https://github.com/willalone/TypoScape/actions/workflows/ci.yml/badge.svg)](https://github.com/willalone/TypoScape/actions/workflows/ci.yml)

**Live demo:** [https://willalone.github.io/TypoScape/](https://willalone.github.io/TypoScape/)

Интерактивная 3D-типографика — объёмное слово **TYPO** в тёмном пространстве с золотистым свечением, bloom и поэтапной анимацией появления.

![TypoScape preview](docs/preview.svg)

> **Демо:** откройте ссылку в Chrome, Firefox или Safari с включённым JavaScript и WebGL. Если сцена не загрузилась — обновите страницу или проверьте аппаратное ускорение в настройках браузера.

## Дизайн-концепция

**Идея:** типографика как физический объект в пространстве — не плоский текст, а материал со светом и весом.

**Палитра:** глубокий индиго-чёрный фон (`#020408`) и янтарно-золотые буквы. Высокий контраст обеспечивает мгновенную читаемость слова TYPO.

**Материал:** объёмные буквы с emissive-подсветкой и тёмной обводкой. Каждая буква слегка отличается по оттенку, но воспринимается как единое слово.

**Движение:** буквы появляются по очереди (T → Y → P → O) с вспышкой света. Hover — пульсация и подъём. Click — сжатие, взлёт, вращение, мягкое приземление.

**Атмосфера:** мерцающие частицы, градиентное небо, тонкая сетка — фон не конкурирует с буквами, а подчёркивает их.

## Технологии

Vue 3 · TypeScript · Three.js · TextGeometry · GSAP · Bloom · Pinia · Vite · Docker

## Возможности

- Объёмные 3D-буквы (TextGeometry) с обводкой и emissive-подсветкой
- Поэтапная анимация загрузки + прогресс-бар
- Hover / click с звуком (можно отключить)
- Карточка с ролью буквы при клике
- Адаптивная камера для мобильных
- Graceful fallback при ошибке инициализации WebGL
- Code splitting (Three.js, GSAP)

## Структура проекта

```
src/
├── App.vue                 — корневой layout
├── components/
│   ├── TypoScene.vue       — canvas + инициализация сцены
│   ├── AppOverlay.vue      — UI, подсказки, звук
│   ├── LoadingOverlay.vue  — прогресс загрузки
│   └── WebGLFallback.vue   — экран ошибки WebGL
├── three/
│   ├── TypoSceneController.ts
│   ├── createLetters.ts
│   ├── animations.ts
│   └── createPostProcessing.ts
├── stores/sceneStore.ts
└── constants/config.ts
```

## Быстрый старт

```bash
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

## Деплой

1. **Settings → Pages** → Source: **GitHub Actions**
2. Push в `main` — CI соберёт и задеплоит `dist/`

## Лицензия

MIT
