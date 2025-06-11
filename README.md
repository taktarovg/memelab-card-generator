# 🧪 MEMELAB Card Generator

**Программный генератор коллекционных карточек без ограничений AI**

## 🎯 Что это такое?

Веб-приложение для создания карточек MEMELAB с полным контролем над дизайном. Никаких ограничений AI - только чистый код и ваше творчество!

## ✅ Преимущества перед AI генераторами:

- 🦷 **Нет цензуры** - можно создавать персонажей с острыми зубами
- ⚡ **Мгновенная генерация** - результат за секунды
- 🎨 **Полный контроль** - точная настройка каждого элемента
- 💰 **Бесплатно** - никаких подписок и кредитов
- 🔧 **Кастомизация** - легко адаптировать под новые коллекции

## 🚀 Быстрый старт:

### 1. Локальный запуск:
```bash
# Склонируй репозиторий
git clone https://github.com/username/memelab-card-generator

# Открой index.html в браузере
open index.html
```

### 2. GitHub Pages (рекомендуется):
1. Загрузи файлы в GitHub репозиторий
2. Включи GitHub Pages в настройках
3. Открой по ссылке: `https://username.github.io/memelab-card-generator`

## 🎮 Как использовать:

### Создание одной карточки:
1. **Загрузи изображение** персонажа (твои Labubu фото)
2. **Заполни данные** - название, редкость, мем-силу
3. **Выбери стиль** - цветовую схему
4. **Нажми "Сгенерировать"** 
5. **Скачай результат** в PNG

### Массовая генерация:
1. **Нажми "Массовая генерация"**
2. **Получи 4 демо карточки** разной редкости
3. **Кликни на любую** для скачивания

## 📁 Структура файлов:

```
card-generator/
├── index.html              # Веб-интерфейс
├── cardGenerator.js         # Основная логика
├── cards_config.json        # Конфигурация карточек
├── README.md               # Эта инструкция
└── assets/                 # Изображения персонажей (создай папку)
    ├── labubu/
    │   ├── classic.png
    │   ├── programmer.png
    │   └── winter.png
    └── backgrounds/
```

## 🔧 Настройка для твоих персонажей:

### 1. Добавь изображения Labubu:
```
assets/labubu/
├── classic.png         # Базовый Лабубу
├── programmer.png      # Лабубу программист  
├── doctor.png          # Лабубу доктор
├── winter.png          # Зимний Лабубу
└── lisa.png           # Лабубу Blackpink Lisa
```

### 2. Обнови конфигурацию в `cards_config.json`:
```json
{
  "cards": [
    {
      "name": "Твоя карточка",
      "rarity": "epic", 
      "memePower": 8000,
      "description": "Описание карточки",
      "colorScheme": "pink_purple",
      "imagePath": "assets/labubu/твой_файл.png"
    }
  ]
}
```

### 3. Автоматическая загрузка изображений:
Добавь в `cardGenerator.js`:
```javascript
// Автозагрузка изображения для карточки
loadCardImage(imagePath) {
    const img = new Image();
    img.onload = () => {
        this.currentCharacterImage = img;
        this.generateCard();
    };
    img.src = imagePath;
}
```

## 🎨 Кастомизация стилей:

### Добавление новых цветовых схем:
```javascript
this.colorSchemes.новая_схема = {
    gradient: ['#цвет1', '#цвет2'],
    text: '#цвет_текста',
    accent: '#цвет_акцента'
};
```

### Настройка эффектов редкости:
```javascript
this.raritySettings.новая_редкость = {
    borderColor: '#цвет_рамки',
    borderWidth: 12,
    glowIntensity: 30,
    textColor: '#цвет_текста'
};
```

## 📊 Массовое производство:

### Для создания всех 100 карточек:
1. **Подготовь 100 изображений** персонажей
2. **Обнови `cards_config.json`** с полным списком
3. **Запусти batch генерацию**
4. **Получи все карточки** за несколько минут

### Автоматизация через скрипт:
```javascript
// Генерация всей коллекции
async function generateFullCollection() {
    const cards = await fetch('cards_config.json').then(r => r.json());
    
    for (const card of cards.collections.labubu_meme_lab.cards) {
        await generateCardFromConfig(card);
        await sleep(100); // Пауза между карточками
    }
}
```

## 🌐 Развертывание на GitHub Pages:

### Пошаговая инструкция:
1. **Создай репозиторий** `memelab-card-generator`
2. **Загрузи все файлы** в репозиторий
3. **Settings → Pages → Source: Deploy from branch**
4. **Выбери main branch**
5. **Получи ссылку:** `https://username.github.io/memelab-card-generator`

### Автоматическое обновление:
- При изменении файлов → автоматический деплой
- Новые карточки доступны сразу всем пользователям
- Можно дать ссылку команде для совместной работы

## 🔄 Интеграция с MEMELAB игрой:

### API для генерации карточек:
```javascript
// Генерация карточки по запросу
async function generateCardAPI(cardData) {
    const generator = new CardGenerator();
    const canvas = await generator.generateCard(cardData);
    return canvas.toDataURL(); // Base64 изображение
}
```

### Интеграция с основным проектом:
```bash
# Добавить как git submodule
git submodule add https://github.com/username/memelab-card-generator card-generator

# Использовать в основном проекте
import { CardGenerator } from './card-generator/cardGenerator.js';
```

## 📈 Планы развития:

### Фаза 1 (Готово):
- ✅ Базовый генератор карточек
- ✅ Система редкости и эффектов
- ✅ Массовая генерация
- ✅ Скачивание PNG

### Фаза 2 (В планах):
- [ ] Анимированные эффекты для Legendary
- [ ] Автозагрузка из CSV файла
- [ ] Пакетное скачивание ZIP
- [ ] Интеграция с API игры

### Фаза 3 (Будущее):
- [ ] 3D эффекты для карточек
- [ ] Видео preview для Stories
- [ ] Интерактивные элементы
- [ ] AR фильтры для карточек

## 🎯 Готовый результат:

**За 1 день работы ты получишь:**
- 🎨 100+ уникальных карточек высокого качества
- ⚡ Мгновенную генерацию новых карточек
- 🔧 Полностью настраиваемую систему
- 💰 Экономию $50+ на AI подписках
- 🚀 Готовое решение для масштабирования

## 📞 Поддержка:

- **Баги и вопросы:** GitHub Issues
- **Новые фичи:** Pull Requests welcome
- **Документация:** См. комментарии в коде

---

**Создано для проекта MEMELAB 🧪**  
*Где мемы становятся легендами!*