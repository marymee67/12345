// cart.js - Управление корзиной товаров

class Cart {
    constructor() {
        this.items = this.loadFromStorage();
        this.updateCartIcon();
    }

    loadFromStorage() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartIcon();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveToStorage();
        this.showNotification('Товар добавлен в корзину!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
    }

    getItems() {
        return this.items;
    }

    getTotalQuantity() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateCartIcon() {
        const total = this.getTotalQuantity();
        const cartIcons = document.querySelectorAll('.cart-icon');
        
        cartIcons.forEach(icon => {
            let badge = icon.querySelector('.cart-badge');
            
            if (!badge && total > 0) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
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

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

const cart = new Cart();