// Функция для выбора способа доставки
window.selectDeliveryMethod = function(method) {
    // Сохраняем выбранный способ доставки в localStorage
    const deliveryData = {
        method: method,
        selectedAt: new Date().toISOString()
    };
    
    // Получаем информацию о стоимости
    const deliveryCosts = {
        courier: { min: 500, freeFrom: 5000, name: 'Курьерская доставка' },
        pickup: { min: 350, freeFrom: 5000, name: 'Пункты выдачи' },
        post: { min: 400, freeFrom: 5000, name: 'Почта России' },
        cdek: { min: 550, freeFrom: 5000, name: 'СДЭК' }
    };
    
    deliveryData.cost = deliveryCosts[method];
    deliveryData.costInfo = deliveryCosts[method];
    
    localStorage.setItem('selectedDelivery', JSON.stringify(deliveryData));
    
    // Показываем уведомление
    showDeliveryNotification(method);
    
    // Если есть товары в корзине, предлагаем перейти к оформлению
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length > 0) {
        setTimeout(() => {
            const goToCheckout = confirm('Способ доставки выбран! Перейти к оформлению заказа?');
            if (goToCheckout) {
                window.location.href = 'checkout.html';
            }
        }, 500);
    } else {
        setTimeout(() => {
            const goToCatalog = confirm('Способ доставки сохранён! Хотите перейти в каталог, чтобы выбрать товары?');
            if (goToCatalog) {
                window.location.href = 'catalog.html';
            }
        }, 500);
    }
};

// Функция показа уведомления о выборе доставки
function showDeliveryNotification(method) {
    const methodNames = {
        courier: 'Курьерская доставка',
        pickup: 'Пункты выдачи',
        post: 'Почта России',
        cdek: 'СДЭК'
    };
    
    // Создаём уведомление
    const notification = document.createElement('div');
    notification.className = 'delivery-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a6a86c">
                <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div>
                <strong>Способ доставки выбран!</strong><br>
                ${methodNames[method]} сохранён в вашем заказе
            </div>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid #a6a86c;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Функция для получения выбранного способа доставки (для других страниц)
window.getSelectedDelivery = function() {
    const delivery = localStorage.getItem('selectedDelivery');
    return delivery ? JSON.parse(delivery) : null;
};

// Функция для расчёта стоимости доставки на основе суммы заказа
window.calculateDeliveryCost = function(orderTotal) {
    const selectedDelivery = getSelectedDelivery();
    
    if (!selectedDelivery) {
        return { cost: 0, isFree: false, method: null };
    }
    
    const isFree = orderTotal >= selectedDelivery.costInfo.freeFrom;
    const cost = isFree ? 0 : selectedDelivery.costInfo.min;
    
    return {
        cost: cost,
        isFree: isFree,
        method: selectedDelivery.method,
        methodName: selectedDelivery.costInfo.name
    };
};

// Инициализация FAQ (аккордеон)
document.addEventListener('DOMContentLoaded', function() {
    // FAQ toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Закрываем все FAQ
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Открываем текущий, если он не был активен
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Обновляем счетчики корзины и избранного
    updateCounters();
    
    // Подсвечиваем выбранный способ доставки при загрузке
    highlightSelectedDelivery();
    
    // Добавляем стили для анимаций
    addAnimationStyles();
});

// Обновление счетчиков
function updateCounters() {
    // Обновляем счетчик корзины
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'inline-block' : 'none';
    }
    
    // Обновляем счетчик избранного
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteCountElement = document.getElementById('favoriteCount');
    if (favoriteCountElement) {
        favoriteCountElement.textContent = favorites.length;
        favoriteCountElement.style.display = favorites.length > 0 ? 'inline-block' : 'none';
    }
}

// Подсветка выбранного способа доставки
function highlightSelectedDelivery() {
    const selectedDelivery = getSelectedDelivery();
    
    if (selectedDelivery && selectedDelivery.method) {
        const cards = document.querySelectorAll('.delivery-card');
        cards.forEach(card => {
            const cardType = card.getAttribute('data-delivery-type');
            if (cardType === selectedDelivery.method) {
                card.style.border = '2px solid #a6a86c';
                card.style.backgroundColor = '#f9f9f0';
                
                // Добавляем метку "Выбрано"
                const existingBadge = card.querySelector('.selected-badge');
                if (!existingBadge) {
                    const badge = document.createElement('div');
                    badge.className = 'selected-badge';
                    badge.textContent = '✓ ВЫБРАНО';
                    badge.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: #a6a86c;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 20px;
                        font-size: 10px;
                        font-weight: bold;
                    `;
                    card.style.position = 'relative';
                    card.appendChild(badge);
                }
            }
        });
    }
}

// Добавление стилей анимации
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        .select-delivery-btn {
            margin-top: 15px;
            padding: 8px 16px;
            background: #a6a86c;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Gothic60', 'Manrope', sans-serif;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        
        .select-delivery-btn:hover {
            background: #8f9158;
            transform: scale(1.05);
        }
        
        .cart-count, .favorite-count {
            position: absolute;
            top: -8px;
            right: -12px;
            background: #FF6161;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .icon {
            position: relative;
        }
    `;
    document.head.appendChild(style);
}

// Экспорт функций для глобального использования
window.deliveryUtils = {
    selectDeliveryMethod: window.selectDeliveryMethod,
    getSelectedDelivery: window.getSelectedDelivery,
    calculateDeliveryCost: window.calculateDeliveryCost
};