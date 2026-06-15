# TypoScape

[![CI](https://github.com/willalone/TypoScape/actions/workflows/ci.yml/badge.svg)](https://github.com/willalone/TypoScape/actions/workflows/ci.yml)

**Live demo:** [https://willalone.github.io/TypoScape/](https://willalone.github.io/TypoScape/)

Интерактивная 3D-типографика — объёмное слово **TYPO** в тёмном пространстве с золотистым свечением, bloom и поэтапной анимацией появления.

![TypoScape preview](docs/preview.svg)

## Дизайн-концепция

**Идея:** типографика как физический объект в пространстве — не плоский текст, а материал со светом и весом.

**Палитра:** глубокий индиго-чёрный фон (`#020408`) и янтарно-золотые буквы. Высокий контраст обеспечивает мгновенную читаемость слова TYPO.

**Материал:** полупрозрачное стекло с тёплым emissive-свечением и тёмной обводкой. Каждая буква слегка отличается по оттенку, но воспринимается как единое слово.

**Движение:** буквы появляются по очереди (T → Y → P → O) с вспышкой света. Hover — пульсация и подъём. Click — сжатие, взлёт, вращение, мягкое приземление.

**Атмосфера:** мерцающие частицы, градиентное небо, тонкая сетка — фон не конкурирует с буквами, а подчёркивает их.

## Технологии

Vue 3 · Three.js · TextGeometry · GSAP · Bloom · Pinia · Vite · Docker

## Возможности

- Объёмные 3D-буквы с обводкой и emissive-подсветкой
- Поэтапная анимация загрузки + прогресс-бар
- Hover / click с звуком (можно отключить)
- Карточка с ролью буквы при клике
- Адаптивная камера для мобильных
- WebGL fallback
- Code splitting (Three.js, GSAP)

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

**Settings → Pages** → Source: **GitHub Actions** → push в `main`

## Лицензия

MIT
