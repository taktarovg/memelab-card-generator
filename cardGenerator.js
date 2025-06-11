// MEMELAB Card Generator - основная логика
class CardGenerator {
    constructor() {
        this.canvas = document.getElementById('cardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentCharacterImage = null;
        this.generatedCards = [];
        
        // Polyfill для roundRect (для старых браузеров)
        this.addRoundRectPolyfill();
        
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
            },
            // NFT-стиль цветовые схемы
            nft_holographic: {
                gradient: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
                text: '#FFFFFF',
                accent: '#FFD93D',
                metallic: '#C0C0C0'
            },
            crypto_gold: {
                gradient: ['#F7931E', '#FFD700', '#FFA500'],
                text: '#000000',
                accent: '#FF4500',
                metallic: '#DAA520'
            },
            cyber_neon: {
                gradient: ['#FF00FF', '#00FFFF', '#FF1493'],
                text: '#FFFFFF',
                accent: '#00FF00',
                metallic: '#8A2BE2'
            },
            galaxy_rare: {
                gradient: ['#1e3c72', '#2a5298', '#6a11cb', '#2575fc'],
                text: '#FFFFFF',
                accent: '#FFD700',
                metallic: '#4B0082'
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
        this.addInteractiveEffects();
    }
    
    // Polyfill для roundRect
    addRoundRectPolyfill() {
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
                if (typeof radii === 'number') {
                    radii = [radii, radii, radii, radii];
                }
                
                this.beginPath();
                this.moveTo(x + radii[0], y);
                this.lineTo(x + width - radii[1], y);
                this.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
                this.lineTo(x + width, y + height - radii[2]);
                this.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
                this.lineTo(x + radii[3], y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
                this.lineTo(x, y + radii[0]);
                this.quadraticCurveTo(x, y, x + radii[0], y);
                this.closePath();
            };
        }
    }
    
    // Интерактивные эффекты для holographic
    addInteractiveEffects() {
        const canvas = this.canvas;
        
        // Mouse movement для holographic effect
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Создаем dynamic reflection на основе позиции мыши
            this.updateReflection(x, y);
        });
        
        // Hover effects
        canvas.addEventListener('mouseenter', () => {
            canvas.style.transform = 'scale(1.02) rotateX(5deg)';
            canvas.style.transition = 'transform 0.3s ease';
            canvas.style.filter = 'brightness(1.1) contrast(1.1)';
        });
        
        canvas.addEventListener('mouseleave', () => {
            canvas.style.transform = 'scale(1) rotateX(0deg)';
            canvas.style.filter = 'brightness(1) contrast(1)';
        });
    }
    
    // Обновление отражения на основе позиции мыши
    updateReflection(mouseX, mouseY) {
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (mouseY - centerY) / centerY * 10;
        const rotateY = (centerX - mouseX) / centerX * 10;
        
        // Ограничиваем углы поворота
        const clampedRotateX = Math.max(-15, Math.min(15, rotateX));
        const clampedRotateY = Math.max(-15, Math.min(15, rotateY));
        
        this.canvas.style.transform = 
            `perspective(1000px) rotateX(${clampedRotateX}deg) rotateY(${clampedRotateY}deg) scale(1.02)`;
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
    
    // Создание голографического фона (NFT-стиль)
    createHolographicBackground(colorScheme, rarity) {
        const colors = this.colorSchemes[colorScheme];
        
        // Проверяем, есть ли NFT-стиль цвета
        if (colors.gradient.length > 2) {
            // Создаем голографический эффект
            const gradient = this.ctx.createRadialGradient(
                this.cardWidth/2, this.cardHeight/2, 0,
                this.cardWidth/2, this.cardHeight/2, this.cardWidth/2
            );
            
            // Голографические цвета с metallic effect
            gradient.addColorStop(0, colors.gradient[0] + 'FF');
            gradient.addColorStop(0.3, colors.gradient[1] + 'DD');
            gradient.addColorStop(0.7, colors.gradient[2] + '88');
            gradient.addColorStop(1, colors.gradient[3] + 'AA');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);
            
            // Добавляем holographic overlay
            this.addHolographicOverlay(rarity);
        } else {
            // Обычный градиент для старых схем
            this.createBackground(colorScheme);
        }
        
        // Добавляем специальные эффекты для редких карточек (для всех схем)
        if (this.colorSchemes[colorScheme].gradient.length > 2) {
            this.addSpecialEffects(rarity);
        }
    }
    
    // Создание обычного градиентного фона
    createBackground(colorScheme) {
        const colors = this.colorSchemes[colorScheme];
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.cardHeight);
        gradient.addColorStop(0, colors.gradient[0]);
        gradient.addColorStop(1, colors.gradient[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);
    }
    
    // Добавление голографического оверлея
    addHolographicOverlay(rarity) {
        const intensity = {
            common: 0.15,
            rare: 0.4,
            epic: 0.7,
            legendary: 1.0
        }[rarity];
        
        // Используем animationOffset для движущихся отражений
        const offset = this.animationOffset || 0;
        const angle = offset + Math.PI / 4;
        
        // Создаем rainbow gradient для holographic effect
        const holoGradient = this.ctx.createLinearGradient(
            Math.cos(angle) * this.cardWidth,
            Math.sin(angle) * this.cardHeight,
            Math.cos(angle + Math.PI) * this.cardWidth,
            Math.sin(angle + Math.PI) * this.cardHeight
        );
        
        holoGradient.addColorStop(0, `rgba(255,0,255,${intensity * 0.3})`);
        holoGradient.addColorStop(0.25, `rgba(0,255,255,${intensity * 0.2})`);
        holoGradient.addColorStop(0.5, `rgba(255,255,0,${intensity * 0.3})`);
        holoGradient.addColorStop(0.75, `rgba(255,0,0,${intensity * 0.2})`);
        holoGradient.addColorStop(1, `rgba(0,255,0,${intensity * 0.3})`);
        
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = holoGradient;
        this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    // Добавление специальных эффектов для редких карточек
    addSpecialEffects(rarity) {
        switch(rarity) {
            case 'epic':
                this.addDiscoballEffect();
                this.addSparkleParticles();
                break;
            case 'legendary':
                this.addLightningEffect();
                this.addRainbowCascade();
                this.addDiscoballEffect(); // Легендарные получают все эффекты
                break;
            case 'rare':
                this.addSparkleParticles();
                break;
        }
    }
    
    // Эффект диско шара 🕺
    addDiscoballEffect() {
        const time = (this.animationOffset || Date.now() * 0.001) * 2;
        const centerX = this.cardWidth / 2;
        const centerY = this.cardHeight / 2;
        
        // Создаем 15 пятен света разного размера
        for (let i = 0; i < 15; i++) {
            const angle = (time + i * 0.5) % (Math.PI * 2);
            const radius = 100 + Math.sin(time * 2 + i) * 50;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Размер пятна света
            const size = 20 + Math.sin(time * 3 + i) * 10;
            
            // Цвет пятна (радужный)
            const hue = (time * 50 + i * 30) % 360;
            const color = `hsla(${hue}, 80%, 70%, 0.6)`;
            
            // Рисуем пятно света
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.7, color.replace('0.6', '0.2'));
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    // Эффект мерцающих звездочек ✨
    addSparkleParticles() {
        const time = (this.animationOffset || Date.now() * 0.001) * 3;
        
        // Создаем 25 мерцающих звездочек
        for (let i = 0; i < 25; i++) {
            const x = (i * 157) % this.cardWidth; // Псевдослучайное распределение
            const y = (i * 211) % this.cardHeight;
            
            // Мерцание с разной частотой
            const opacity = (Math.sin(time * 2 + i * 0.5) + 1) / 2;
            const size = 2 + Math.sin(time + i) * 1;
            
            if (opacity > 0.3) { // Показываем только яркие звездочки
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'screen';
                
                // Рисуем звездочку как 4-лучевую звезду
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.lineCap = 'round';
                
                // Горизонтальная линия
                this.ctx.beginPath();
                this.ctx.moveTo(x - size, y);
                this.ctx.lineTo(x + size, y);
                this.ctx.stroke();
                
                // Вертикальная линия
                this.ctx.beginPath();
                this.ctx.moveTo(x, y - size);
                this.ctx.lineTo(x, y + size);
                this.ctx.stroke();
                
                this.ctx.restore();
            }
        }
    }
    
    // Эффект молний для Legendary ⚡
    addLightningEffect() {
        const time = (this.animationOffset || Date.now() * 0.001) * 4;
        
        // Создаем случайные вспышки молний
        for (let i = 0; i < 5; i++) {
            const flashTiming = (time + i * 2) % 6;
            
            if (flashTiming < 0.2) { // Короткая вспышка
                const x1 = (i * 123) % this.cardWidth;
                const y1 = 0;
                const x2 = ((i + 3) * 234) % this.cardWidth;
                const y2 = this.cardHeight;
                
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'screen';
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 - flashTiming * 4})`;
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = '#00FFFF';
                this.ctx.shadowBlur = 10;
                
                // Рисуем зигзагообразную молнию
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                
                const steps = 8;
                for (let s = 1; s <= steps; s++) {
                    const segmentY = (y2 - y1) * (s / steps) + y1;
                    const segmentX = x1 + (x2 - x1) * (s / steps) + (Math.sin(s * 2) * 30);
                    this.ctx.lineTo(segmentX, segmentY);
                }
                
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
    }
    
    // Эффект радужного водопада 🌈
    addRainbowCascade() {
        const time = (this.animationOffset || Date.now() * 0.001) * 2;
        
        // Создаем падающие радужные полосы
        for (let i = 0; i < 8; i++) {
            const x = i * (this.cardWidth / 8) + (time * 50) % this.cardWidth;
            const hue = (time * 60 + i * 45) % 360;
            
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            
            const gradient = this.ctx.createLinearGradient(x, 0, x + 30, 0);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, `hsla(${hue}, 80%, 60%, 0.3)`);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - 15, 0, 30, this.cardHeight);
            
            this.ctx.restore();
        }
    }
    
    // 3D рамка с metallic эффектами (NFT-стиль)
    drawModernBorder(rarity) {
        const settings = this.raritySettings[rarity];
        const borderWidth = settings.borderWidth;
        
        // Создаем 3D эффект рамки
        this.ctx.save();
        
        // Внешняя тень
        this.ctx.shadowColor = settings.borderColor;
        this.ctx.shadowBlur = settings.glowIntensity * 2;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Основная metallic рамка
        const metalGradient = this.ctx.createLinearGradient(0, 0, borderWidth, borderWidth);
        metalGradient.addColorStop(0, this.lightenColor(settings.borderColor, 40));
        metalGradient.addColorStop(0.5, settings.borderColor);
        metalGradient.addColorStop(1, this.darkenColor(settings.borderColor, 30));
        
        this.ctx.strokeStyle = metalGradient;
        this.ctx.lineWidth = borderWidth;
        this.ctx.strokeRect(borderWidth/2, borderWidth/2, 
                           this.cardWidth - borderWidth, 
                           this.cardHeight - borderWidth);
        
        // Добавляем holographic reflections для редких карт
        if (rarity === 'legendary' || rarity === 'epic') {
            this.addBorderReflections(rarity);
        }
        
        this.ctx.restore();
    }
    
    // Отрисовка обычной рамки (для обратной совместимости)
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
    
    // Добавление отражений для рамки
    addBorderReflections(rarity) {
        // Создаем moving reflections эффект
        const time = Date.now() * 0.001;
        const reflection = this.ctx.createLinearGradient(
            Math.sin(time) * 100, Math.cos(time) * 100,
            Math.sin(time + 1) * 100, Math.cos(time + 1) * 100
        );
        
        reflection.addColorStop(0, 'rgba(255,255,255,0)');
        reflection.addColorStop(0.5, 'rgba(255,255,255,0.8)');
        reflection.addColorStop(1, 'rgba(255,255,255,0)');
        
        this.ctx.strokeStyle = reflection;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, this.cardWidth - 20, this.cardHeight - 20);
    }
    
    // Вспомогательные функции для цветов
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
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
    
    // Современная типографика с 3D эффектами
    drawModernText(name, rarity, memePower, description, colorScheme) {
        const colors = this.colorSchemes[colorScheme];
        
        // Заголовок с 3D эффектом
        this.drawTitle3D(name, colors, rarity);
        
        // Редкость с holographic effect
        this.drawRarityBadge(rarity, colors);
        
        // Мем-сила с glow effect
        this.drawMemePowerGlow(memePower, colors);
        
        // Описание с progressive blur
        this.drawDescriptionModern(description, colors);
        
        // Современный watermark
        this.drawModernWatermark();
    }
    
    // Отрисовка обычного текста (для обратной совместимости)
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
    
    // 3D заголовок
    drawTitle3D(name, colors, rarity) {
        this.ctx.save();
        
        // 3D shadow effect
        for(let i = 3; i >= 0; i--) {
            this.ctx.fillStyle = i === 0 ? colors.text : `rgba(0,0,0,${0.3 - i*0.1})`;
            this.ctx.font = "bold 36px 'Orbitron', Arial";
            this.ctx.textAlign = 'center';
            this.ctx.fillText(name, this.cardWidth/2 + i, 100 + i);
        }
        
        // Добавляем holographic effect для legendary
        if (rarity === 'legendary') {
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.fillText(name, this.cardWidth/2, 100);
            this.ctx.globalCompositeOperation = 'source-over';
        }
        
        this.ctx.restore();
    }
    
    // Бэдж редкости
    drawRarityBadge(rarity, colors) {
        const x = 50, y = 630;
        const raritySettings = this.raritySettings[rarity];
        
        // Создаем modern badge
        this.ctx.save();
        
        // Badge background с gradient
        const badgeGradient = this.ctx.createLinearGradient(x, y-15, x, y+15);
        badgeGradient.addColorStop(0, raritySettings.borderColor + 'DD');
        badgeGradient.addColorStop(1, this.darkenColor(raritySettings.borderColor, 30) + 'DD');
        
        this.ctx.fillStyle = badgeGradient;
        this.ctx.beginPath();
        this.ctx.roundRect(x-10, y-20, 100, 30, 15);
        this.ctx.fill();
        
        // Badge text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = "bold 16px 'Orbitron', Arial";
        this.ctx.textAlign = 'left';
        this.ctx.fillText(rarity.toUpperCase(), x, y);
        
        this.ctx.restore();
    }
    
    // Мем-сила с glow эффектом
    drawMemePowerGlow(memePower, colors) {
        this.ctx.save();
        
        // Glow effect
        this.ctx.shadowColor = colors.accent;
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = colors.accent;
        this.ctx.font = "bold 28px 'Orbitron', Arial";
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${memePower}⚡`, this.cardWidth - 50, 650);
        
        this.ctx.restore();
    }
    
    // Современное описание
    drawDescriptionModern(description, colors) {
        this.ctx.save();
        
        this.ctx.fillStyle = colors.text;
        this.ctx.font = "18px 'Orbitron', Arial";
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
        
        // Отрисовываем строки с subtle glow
        this.ctx.shadowColor = 'rgba(255,255,255,0.3)';
        this.ctx.shadowBlur = 5;
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, this.cardWidth / 2, 720 + (index * 25));
        });
        
        this.ctx.restore();
    }
    
    // Современный watermark
    drawModernWatermark() {
        this.ctx.save();
        
        // Создаем gradient для лого
        const logoGradient = this.ctx.createLinearGradient(0, 840, this.cardWidth, 860);
        logoGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        logoGradient.addColorStop(1, 'rgba(255, 215, 0, 0.6)');
        
        this.ctx.fillStyle = logoGradient;
        this.ctx.font = "bold 14px 'Orbitron', Arial";
        this.ctx.textAlign = 'center';
        
        // Эмулируем letterSpacing через отдельные символы
        const text = 'MEMELAB.GAME';
        const letterSpacing = 2;
        let totalWidth = 0;
        for (let i = 0; i < text.length; i++) {
            totalWidth += this.ctx.measureText(text[i]).width + letterSpacing;
        }
        
        let currentX = (this.cardWidth / 2) - (totalWidth / 2);
        for (let i = 0; i < text.length; i++) {
            this.ctx.fillText(text[i], currentX, 850);
            currentX += this.ctx.measureText(text[i]).width + letterSpacing;
        }
        
        this.ctx.restore();
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
        
        // Проверяем, является ли схема NFT-стилем
        const isNFTStyle = ['nft_holographic', 'crypto_gold', 'cyber_neon', 'galaxy_rare'].includes(colorScheme);
        
        if (isNFTStyle) {
            // Используем современные NFT-стиль методы
            this.createHolographicBackground(colorScheme, rarity);
            this.drawModernBorder(rarity);
            this.drawCharacter();
            this.drawModernText(name, rarity, memePower, description, colorScheme);
        } else {
            // Обычные методы для старых схем
            this.createBackground(colorScheme);
            this.drawBorder(rarity);
            this.drawCharacter();
            this.drawText(name, rarity, memePower, description, colorScheme);
        }
        
        console.log(`Карточка "${name}" сгенерирована в ${isNFTStyle ? 'NFT' : 'обычном'} стиле!`);
    }
    
    // Скачивание карточки
    downloadCard() {
        const name = document.getElementById('cardName').value || 'card';
        const link = document.createElement('a');
        link.download = `${name.replace(/\s+/g, '_').toLowerCase()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    // Экспорт анимированной карточки (GIF)
    exportAnimatedCard() {
        const name = document.getElementById('cardName').value || 'card';
        const rarity = document.getElementById('cardRarity').value;
        
        // Только для редких карточек создаем анимацию
        if (rarity === 'common') {
            alert('Анимация доступна только для редких карточек!');
            return;
        }
        
        console.log('Генерация анимированной карточки...');
        
        // Создаем последовательность кадров с holographic эффектом
        const frames = [];
        const totalFrames = 30;
        
        for (let frame = 0; frame < totalFrames; frame++) {
            this.generateFrameWithAnimation(frame, totalFrames);
            frames.push(this.canvas.toDataURL());
        }
        
        // Создаем простую "анимацию" через быструю смену изображений
        this.createAnimatedPreview(frames, name);
    }
    
    // Генерация кадра с анимацией
    generateFrameWithAnimation(frame, totalFrames) {
        // Сохраняем текущее состояние
        const name = document.getElementById('cardName').value || 'Unnamed Card';
        const rarity = document.getElementById('cardRarity').value;
        const memePower = document.getElementById('memePower').value;
        const description = document.getElementById('cardDescription').value || 'Описание карточки';
        const colorScheme = document.getElementById('colorScheme').value;
        
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.cardWidth, this.cardHeight);
        
        // Добавляем анимационный сдвиг для holographic эффекта
        const animationProgress = frame / totalFrames;
        this.animationOffset = animationProgress * Math.PI * 2;
        
        // Генерируем кадр
        const isNFTStyle = ['nft_holographic', 'crypto_gold', 'cyber_neon', 'galaxy_rare'].includes(colorScheme);
        
        if (isNFTStyle) {
            this.createHolographicBackground(colorScheme, rarity);
            this.drawModernBorder(rarity);
            this.drawCharacter();
            this.drawModernText(name, rarity, memePower, description, colorScheme);
        } else {
            this.createBackground(colorScheme);
            this.drawBorder(rarity);
            this.drawCharacter();
            this.drawText(name, rarity, memePower, description, colorScheme);
        }
    }
    
    // Создание анимированного превью
    createAnimatedPreview(frames, name) {
        const previewDiv = document.createElement('div');
        previewDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            padding: 20px;
            border-radius: 15px;
            z-index: 1000;
            text-align: center;
        `;
        
        const img = document.createElement('img');
        img.style.cssText = 'width: 200px; height: auto; border-radius: 10px;';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.style.cssText = `
            margin-top: 10px;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        
        previewDiv.appendChild(img);
        previewDiv.appendChild(document.createElement('br'));
        previewDiv.appendChild(closeBtn);
        document.body.appendChild(previewDiv);
        
        // Анимация смены кадров
        let currentFrame = 0;
        const animateFrames = () => {
            img.src = frames[currentFrame];
            currentFrame = (currentFrame + 1) % frames.length;
            setTimeout(animateFrames, 100); // 10 FPS
        };
        animateFrames();
        
        closeBtn.onclick = () => {
            document.body.removeChild(previewDiv);
        };
        
        console.log(`Анимированная карточка "${name}" готова! ${frames.length} кадров.`);
    }
    
    // AR Preview (упрощенная версия)
    generateARPreview() {
        const arCanvas = document.createElement('canvas');
        arCanvas.width = 1024;
        arCanvas.height = 1024;
        const arCtx = arCanvas.getContext('2d');
        
        // Масштабируем текущую карточку для AR
        arCtx.drawImage(this.canvas, 0, 0, 1024, 1024);
        
        const arDataUrl = arCanvas.toDataURL();
        console.log('AR Preview готов!');
        
        return arDataUrl;
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

function exportAnimatedCard() {
    cardGenerator.exportAnimatedCard();
}

function generateARPreview() {
    const arDataUrl = cardGenerator.generateARPreview();
    
    // Показываем AR preview в модальном окне
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        max-width: 90%;
    `;
    
    const img = document.createElement('img');
    img.src = arDataUrl;
    img.style.cssText = 'max-width: 300px; height: auto; border-radius: 10px;';
    
    const title = document.createElement('h3');
    title.textContent = '🔮 AR-Ready карточка';
    title.style.margin = '0 0 15px 0';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '💾 Скачать AR версию';
    downloadBtn.style.cssText = `
        margin: 10px;
        padding: 10px 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.style.cssText = `
        margin: 10px;
        padding: 10px 20px;
        background: #ccc;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    content.appendChild(title);
    content.appendChild(img);
    content.appendChild(document.createElement('br'));
    content.appendChild(downloadBtn);
    content.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        const name = document.getElementById('cardName').value || 'card';
        link.download = `${name.replace(/\s+/g, '_').toLowerCase()}_ar.png`;
        link.href = arDataUrl;
        link.click();
    };
    
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

function exportGIF() {
    const rarity = document.getElementById('cardRarity').value;
    const name = document.getElementById('cardName').value || 'card';
    
    // Проверяем, что карточка достойна анимации
    if (rarity === 'common') {
        alert('🚫 GIF экспорт доступен только для Rare+ карточек!');
        return;
    }
    
    // Показываем модальное окно с опциями экспорта
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        color: white;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    content.innerHTML = `
        <h2 style="margin: 0 0 20px 0; font-size: 24px;">🎆 GIF Экспорт</h2>
        <p style="margin-bottom: 25px; opacity: 0.9;">Выберите формат анимированного экспорта:</p>
        
        <div style="display: grid; gap: 15px; margin-bottom: 25px;">
            <button id="gifZip" style="
                padding: 15px;
                background: rgba(255,255,255,0.2);
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 10px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 16px;
            ">
                🗄️ ZIP с 30 кадрами PNG<br>
                <small style="opacity: 0.8;">Лучшее качество, можно собрать GIF в Photoshop</small>
            </button>
            
            <button id="webmVideo" style="
                padding: 15px;
                background: rgba(255,255,255,0.2);
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 10px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 16px;
            ">
                🎥 WebM видео<br>
                <small style="opacity: 0.8;">Маленький размер, идеально для соцсетей</small>
            </button>
            
            <button id="htmlPreview" style="
                padding: 15px;
                background: rgba(255,255,255,0.2);
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 10px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 16px;
            ">
                🌐 HTML Превью<br>
                <small style="opacity: 0.8;">Посмотреть анимацию в браузере</small>
            </button>
        </div>
        
        <button id="closeGifModal" style="
            padding: 10px 20px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 8px;
            color: white;
            cursor: pointer;
        ">Закрыть</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Обработчики кнопок
    document.getElementById('gifZip').onclick = () => {
        document.body.removeChild(modal);
        exportFramesAsZip(name);
    };
    
    document.getElementById('webmVideo').onclick = () => {
        document.body.removeChild(modal);
        exportAsWebM(name);
    };
    
    document.getElementById('htmlPreview').onclick = () => {
        document.body.removeChild(modal);
        cardGenerator.exportAnimatedCard(); // Показываем существующее превью
    };
    
    document.getElementById('closeGifModal').onclick = () => {
        document.body.removeChild(modal);
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// Экспорт кадров как ZIP архив
function exportFramesAsZip(cardName) {
    const progressDiv = createProgressModal('Генерируем 30 кадров анимации...');
    
    setTimeout(async () => {
        const frames = [];
        const totalFrames = 30;
        
        // Генерируем кадры
        for (let frame = 0; frame < totalFrames; frame++) {
            cardGenerator.generateFrameWithAnimation(frame, totalFrames);
            
            // Конвертируем canvas в blob
            const dataUrl = cardGenerator.canvas.toDataURL('image/png');
            frames.push({
                name: `frame_${String(frame).padStart(3, '0')}.png`,
                data: dataUrl
            });
            
            // Обновляем прогресс
            updateProgress(progressDiv, (frame + 1) / totalFrames * 100);
            
            // Пауза для отзывчивости UI
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Создаем ссылки для скачивания
        const downloadLinks = document.createElement('div');
        downloadLinks.style.cssText = 'margin-top: 20px;';
        
        frames.forEach((frame, index) => {
            const link = document.createElement('a');
            link.href = frame.data;
            link.download = frame.name;
            link.textContent = `Кадр ${index + 1}`;
            link.style.cssText = `
                display: inline-block;
                margin: 5px;
                padding: 8px 12px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 12px;
            `;
            downloadLinks.appendChild(link);
        });
        
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.textContent = '💾 Скачать все кадры';
        downloadAllBtn.style.cssText = `
            width: 100%;
            padding: 15px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            margin-top: 15px;
            cursor: pointer;
        `;
        
        downloadAllBtn.onclick = () => {
            frames.forEach((frame, index) => {
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = frame.data;
                    link.download = `${cardName}_${frame.name}`;
                    link.click();
                }, index * 100); // Задержка между скачиваниями
            });
        };
        
        updateProgressContent(progressDiv, `
            <h3>✅ 30 кадров готово!</h3>
            <p>Для создания GIF:</p>
            <ol style="text-align: left; margin: 15px 0; padding-left: 20px;">
                <li>Скачайте все кадры</li>
                <li>Откройте Photoshop или GIMP</li>
                <li>Импортируйте как Image Sequence</li>
                <li>Экспортируйте как Animated GIF</li>
            </ol>
        `);
        
        progressDiv.appendChild(downloadAllBtn);
        progressDiv.appendChild(downloadLinks);
        
    }, 100);
}

// Экспорт как WebM видео
function exportAsWebM(cardName) {
    const progressDiv = createProgressModal('Создаем WebM видео...');
    
    // Имитация создания видео (требует MediaRecorder API)
    setTimeout(() => {
        updateProgressContent(progressDiv, `
            <h3>🚧 WebM экспорт в разработке</h3>
            <p>Пока что используйте:</p>
            <ol style="text-align: left; margin: 15px 0; padding-left: 20px;">
                <li>🗄️ ZIP с кадрами для Photoshop</li>
                <li>🌐 HTML превью для просмотра</li>
                <li>📱 Запись экрана через OBS</li>
            </ol>
            <p><small>Полноценный видео экспорт появится в следующем обновлении!</small></p>
        `);
    }, 1000);
}

// Вспомогательные функции для прогресс-бара
function createProgressModal(title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        min-width: 400px;
        max-width: 600px;
    `;
    
    content.innerHTML = `
        <h3 style="margin: 0 0 20px 0;">${title}</h3>
        <div style="
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
        ">
            <div id="progressBar" style="
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.3s ease;
            "></div>
        </div>
        <div id="progressText">0%</div>
        <button onclick="document.body.removeChild(this.closest('.modal') || this.parentElement.parentElement)" style="
            margin-top: 15px;
            padding: 8px 16px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        ">Отмена</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    return modal;
}

function updateProgress(modal, percent) {
    const progressBar = modal.querySelector('#progressBar');
    const progressText = modal.querySelector('#progressText');
    
    progressBar.style.width = percent + '%';
    progressText.textContent = Math.round(percent) + '%';
}

function updateProgressContent(modal, newContent) {
    const content = modal.querySelector('div');
    content.innerHTML = newContent + `
        <button onclick="document.body.removeChild(this.closest('.modal') || this.parentElement.parentElement)" style="
            margin-top: 15px;
            padding: 8px 16px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        ">Закрыть</button>
    `;
}

function clearAll() {
    cardGenerator.clearAll();
}