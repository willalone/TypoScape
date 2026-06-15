# TypoScape

[![CI](https://github.com/willalone/TypoScape/actions/workflows/ci.yml/badge.svg)](https://github.com/willalone/TypoScape/actions/workflows/ci.yml)

**Live demo:** [https://willalone.github.io/TypoScape/](https://willalone.github.io/TypoScape/)

Интерактивная 3D-типографика — объёмные буквы **TYPO** в тёплой редакционной палитре с bloom, мерцающими частицами и многослойными анимациями.

![TypoScape preview](docs/preview.svg)

## Технологии

Vue 3 · Three.js · TextGeometry · GSAP · Post-processing (bloom) · Pinia · Vite

## Возможности

- Объёмные 3D-буквы с glass-metal материалом
- Bloom и vignette
- Анимированный градиентный фон и wireframe-кольца
- Мерцающие частицы на кастомном шейдере
- Волна по буквам в покое
- Hover: масштаб, цвет, пульсация emissive, подъём по Z
- Click: сжатие → взлёт → вращение → мягкое приземление
- Орбитальная камера с авто-вращением

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

Демо: **https://willalone.github.io/TypoScape/**

## Лицензия

MIT
