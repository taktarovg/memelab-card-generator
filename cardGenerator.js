// MEMELAB Card Generator - основная логика
class CardGenerator {
    constructor() {
        this.canvas = document.getElementById('cardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentCharacterImage = null;
        this.generatedCards = [];
        
        // Настройки карточки
        this.cardWidth = 630;
        this.cardHeight = 880;
        
        // Цветовые схемы
        this.colorSchemes = {
            pink_purple: {
                gradient: ['#FF69B4', '#8B66CC'],
                text: '#FFFFFF',
                accent: '#FFD700'
            },
            blue_cyan: {
                gradient: ['#4FC3F7', '#29B6F6'],
                text: '#FFFFFF', 
                accent: '#00E676'
            },
            gold_yellow: {
                gradient: ['#FFD700', '#FFA000'],
                text: '#000000',
                accent: '#FF5722'
            },
            green_mint: {
                gradient: ['#4CAF50', '#26A69A'],
                text: '#FFFFFF',
                accent: '#FFC107'
            }
        };
        
        // Настройки редкости
        this.raritySettings = {
            common: {
                borderColor: '#9E9E9E',
                borderWidth: 4,
                glowIntensity: 0,
                textColor: '#666666'
            },
            rare: {
                borderColor: '#2196F3',
                borderWidth: 6,
                glowIntensity: 10,
                textColor: '#1976D2'
            },
            epic: {
                borderColor: '#9C27B0',
                borderWidth: 8,
                glowIntensity: 15,
                textColor: '#7B1FA2'
            },
            legendary: {
                borderColor: '#FFD700',
                borderWidth: 10,
                glowIntensity: 20,
                textColor: '#F57C00'
            }
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Обработчик загрузки изображения
        document.getElementById('characterImage').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        this.currentCharacterImage = img;
                        this.generateCard();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Создание градиентного фона
    createBackground(colorScheme) {
        const colors = this.colorSchemes[colorScheme];
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.cardHeight);
        gradient.addColorStop(0, colors.gradient[0]);
        gradient.addColorStop(1, colors.gradient[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);
    }
    
    // Отрисовка рамки в зависимости от редкости
    drawBorder(rarity) {
        const settings = this.raritySettings[rarity];
        
        // Основная рамка
        this.ctx.strokeStyle = settings.borderColor;
        this.ctx.lineWidth = settings.borderWidth;
        this.ctx.strokeRect(
            settings.borderWidth / 2, 
            settings.borderWidth / 2, 
            this.cardWidth - settings.borderWidth, 
            this.cardHeight - settings.borderWidth
        );
        
        // Эффект свечения для редких карточек
        if (settings.glowIntensity > 0) {
            this.ctx.shadowColor = settings.borderColor;
            this.ctx.shadowBlur = settings.glowIntensity;
            this.ctx.strokeRect(
                settings.borderWidth / 2, 
                settings.borderWidth / 2, 
                this.cardWidth - settings.borderWidth, 
                this.cardHeight - settings.borderWidth
            );
            this.ctx.shadowBlur = 0;
        }
    }
    
    // Отрисовка персонажа
    drawCharacter() {
        if (!this.currentCharacterImage) {
            // Placeholder если нет изображения
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fillRect(140, 200, 350, 350);
            
            this.ctx.fillStyle = '#666';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎴', this.cardWidth / 2, 400);
            return;
        }
        
        // Вычисляем размеры для сохранения пропорций
        const maxWidth = 350;
        const maxHeight = 350;
        const x = 140;
        const y = 200;
        
        let drawWidth = maxWidth;
        let drawHeight = maxHeight;
        
        const imgRatio = this.currentCharacterImage.width / this.currentCharacterImage.height;
        const maxRatio = maxWidth / maxHeight;
        
        if (imgRatio > maxRatio) {
            drawHeight = maxWidth / imgRatio;
        } else {
            drawWidth = maxHeight * imgRatio;
        }
        
        // Центрируем изображение
        const drawX = x + (maxWidth - drawWidth) / 2;
        const drawY = y + (maxHeight - drawHeight) / 2;
        
        this.ctx.drawImage(
            this.currentCharacterImage, 
            drawX, drawY, 
            drawWidth, drawHeight
        );
    }
    
    // Отрисовка текста
    drawText(name, rarity, memePower, description, colorScheme) {
        const colors = this.colorSchemes[colorScheme];
        const raritySettings = this.raritySettings[rarity];
        
        // Название карточки
        this.ctx.fillStyle = colors.text;
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, this.cardWidth / 2, 100);
        
        // Редкость
        this.ctx.fillStyle = raritySettings.textColor;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(rarity.toUpperCase(), 50, 650);
        
        // Мем-сила
        this.ctx.fillStyle = colors.accent;
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${memePower}⚡`, this.cardWidth - 50, 650);
        
        // Описание
        this.ctx.fillStyle = colors.text;
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        
        // Разбиваем описание на строки
        const words = description.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = this.ctx.measureText(currentLine + " " + word).width;
            if (width < 500) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        // Отрисовываем строки описания
        lines.forEach((line, index) => {
            this.ctx.fillText(line, this.cardWidth / 2, 720 + (index * 25));
        });
        
        // MEMELAB лого
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('MEMELAB.GAME', this.cardWidth / 2, 850);
    }
    
    // Основная функция генерации
    generateCard() {
        const name = document.getElementById('cardName').value || 'Unnamed Card';
        const rarity = document.getElementById('cardRarity').value;
        const memePower = document.getElementById('memePower').value;
        const description = document.getElementById('cardDescription').value || 'Описание карточки';
        const colorScheme = document.getElementById('colorScheme').value;
        
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.cardWidth, this.cardHeight);
        
        // Отрисовываем элементы карточки
        this.createBackground(colorScheme);
        this.drawBorder(rarity);
        this.drawCharacter();
        this.drawText(name, rarity, memePower, description, colorScheme);
        
        console.log(`Карточка "${name}" сгенерирована!`);
    }
    
    // Скачивание карточки
    downloadCard() {
        const name = document.getElementById('cardName').value || 'card';
        const link = document.createElement('a');
        link.download = `${name.replace(/\s+/g, '_').toLowerCase()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    // Массовая генерация
    async generateBatch() {
        const batchCards = [
            {
                name: 'Labubu Classic',
                rarity: 'common',
                memePower: 3000,
                description: 'Классический Лабубу в базовом стиле',
                colorScheme: 'pink_purple'
            },
            {
                name: 'Labubu Programmer',
                rarity: 'rare',
                memePower: 6000,
                description: 'Лабубу программист за работой',
                colorScheme: 'blue_cyan'
            },
            {
                name: 'Labubu Russian Winter',
                rarity: 'epic',
                memePower: 8000,
                description: 'Лабубу в русском зимнем стиле',
                colorScheme: 'blue_cyan'
            },
            {
                name: 'Labubu Blackpink Lisa',
                rarity: 'legendary',
                memePower: 10000,
                description: 'Легендарная карточка с эстетикой Blackpink',
                colorScheme: 'pink_purple'
            }
        ];
        
        const cardsContainer = document.getElementById('generatedCards');
        cardsContainer.innerHTML = '';
        
        for (let i = 0; i < batchCards.length; i++) {
            const card = batchCards[i];
            
            // Обновляем поля формы
            document.getElementById('cardName').value = card.name;
            document.getElementById('cardRarity').value = card.rarity;
            document.getElementById('memePower').value = card.memePower;
            document.getElementById('cardDescription').value = card.description;
            document.getElementById('colorScheme').value = card.colorScheme;
            
            // Генерируем карточку
            this.generateCard();
            
            // Сохраняем в галерею
            await this.saveToGallery(card);
            
            // Добавляем задержку между генерациями
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log(`Batch generation completed: ${batchCards.length} cards`);
    }
    
    // Сохранение в галерею
    async saveToGallery(cardData) {
        const cardsContainer = document.getElementById('generatedCards');
        
        // Создаем миниатюру карточки
        const cardDiv = document.createElement('div');
        cardDiv.className = `generated-card rarity-${cardData.rarity}`;
        
        const img = document.createElement('img');
        img.src = this.canvas.toDataURL();
        img.alt = cardData.name;
        img.title = cardData.name;
        
        const cardInfo = document.createElement('div');
        cardInfo.style.padding = '10px';
        cardInfo.style.color = 'black';
        cardInfo.innerHTML = `
            <h3>${cardData.name}</h3>
            <p><strong>${cardData.rarity.toUpperCase()}</strong> | ${cardData.memePower}⚡</p>
        `;
        
        cardDiv.appendChild(img);
        cardDiv.appendChild(cardInfo);
        cardsContainer.appendChild(cardDiv);
        
        // Добавляем обработчик клика для скачивания
        cardDiv.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `${cardData.name.replace(/\s+/g, '_').toLowerCase()}.png`;
            link.href = img.src;
            link.click();
        });
    }
    
    // Очистка всех карточек
    clearAll() {
        document.getElementById('generatedCards').innerHTML = '';
        this.ctx.clearRect(0, 0, this.cardWidth, this.cardHeight);
        console.log('Все карточки очищены');
    }
}

// Инициализация при загрузке страницы
let cardGenerator;

window.addEventListener('DOMContentLoaded', () => {
    cardGenerator = new CardGenerator();
    
    // Генерируем демо карточку
    setTimeout(() => {
        cardGenerator.generateCard();
    }, 100);
});

// Глобальные функции для кнопок
function generateCard() {
    cardGenerator.generateCard();
}

function generateBatch() {
    cardGenerator.generateBatch();
}

function downloadCard() {
    cardGenerator.downloadCard();
}

function clearAll() {
    cardGenerator.clearAll();
}