# Weather Cities App

Приложение для отображения погоды в городах на Next.js и OpenWeatherMap API.

## Технологии

- Next.js 14
- React 18
- TypeScript
- Redux Toolkit
- SCSS Modules
- Jest + Testing Library

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env.local` в корне проекта:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

   Получить API ключ можно на [OpenWeatherMap](https://openweathermap.org/api)

3. Запустите проект:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Тестирование

Запустить тесты:
```bash
npm test
```

## Сборка

Создать production сборку:
```bash
npm run build
```

Запустить production сервер:
```bash
npm start
```
