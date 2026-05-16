// favorites.js - Управление избранными товарами

class Favorites {
    constructor() {
        this.items = this.loadFromStorage();
        this.updateFavoritesIcon();
        console.log('Favorites инициализирован, товаров:', this.items.length);
        
        // Слушаем изменения в localStorage из других вкладок
        window.addEventListener('storage', (e) => {
            if (e.key === 'favorites') {
                this.items = this.loadFromStorage();
                this.updateFavoritesIcon();
                document.dispatchEvent(new Event('favoritesUpdated'));
            }
        });
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('favorites');
            return saved ? JSON.parse(saved) : [];
        } catch(e) {
            console.error('Ошибка загрузки избранного:', e);
            return [];
        }
    }

    saveToStorage() {
        localStorage.setItem('favorites', JSON.stringify(this.items));
        this.updateFavoritesIcon();
        document.dispatchEvent(new Event('favoritesUpdated'));
        console.log('Сохранено в избранное:', this.items.length, 'товаров');
    }

    addToFavorites(product) {
        if (!product || !product.id) {
            console.error('Некорректный товар');
            return false;
        }
        
        if (!this.isFavorite(product.id)) {
            this.items.push({
                id: product.id,
                name: product.name || 'Товар',
                price: product.price || 0,
                img: product.img || '',
                category: product.category || 'lamp'
            });
            this.saveToStorage();
            console.log('Товар добавлен в избранное:', product.name);
            return true;
        }
        console.log('Товар уже в избранном:', product.name);
        return false;
    }

    removeFromFavorites(productId) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== productId);
        if (initialLength !== this.items.length) {
            this.saveToStorage();
            console.log('Товар удален из избранного, id:', productId);
            return true;
        }
        return false;
    }

    isFavorite(productId) {
        return this.items.some(item => item.id === productId);
    }

    getItems() {
        return [...this.items];
    }

    getTotalCount() {
        return this.items.length;
    }

    updateFavoritesIcon() {
        const total = this.getTotalCount();
        const favIcons = document.querySelectorAll('.icon-favorite');
        
        favIcons.forEach(icon => {
            let badge = icon.querySelector('.favorites-badge');
            
            if (!badge && total > 0) {
                badge = document.createElement('span');
                badge.className = 'favorites-badge';
                icon.style.position = 'relative';
                icon.appendChild(badge);
            }
            
            if (badge) {
                if (total > 0) {
                    badge.textContent = total > 99 ? '99+' : total;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        });
    }
}

// Создаем глобальный экземпляр
const favorites = new Favorites();

// Добавляем стили для бейджа
if (!document.querySelector('#favorites-badge-styles')) {
    const style = document.createElement('style');
    style.id = 'favorites-badge-styles';
    style.textContent = `
        .favorites-badge {
            position: absolute;
            top: -8px;
            right: -12px;
            background: #FF6161;
            color: white;
            font-size: 10px;
            font-weight: bold;
            min-width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
            font-family: 'Gothic60', sans-serif;
            animation: badgePop 0.3s ease;
        }
        
        @keyframes badgePop {
            0% { transform: scale(0); }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}