// Данные товаров
const products = [
    {
        id: 1,
        name: "Miss Dior Essence Dior",
        description: "Цветочный, свежий аромат с нотами ириса и жасмина",
        price: 17900,
        categories: ["цветочный", "свежий"],
        image: "assets/images/missdioressence.jpg"
    },
    {
        id: 2,
        name: "Black Opium Over Red YSL",
        description: "Сладкий, восточный аромат с кофе и ванилью",
        price: 15500,
        categories: ["сладкий", "восточный"],
        image: "assets/images/opiumysl.jpg"
    },
    {
        id: 3,
        name: "Reine de Nuit Byredo",
        description: "Таинственный, ночной аромат с пачули и амброй",
        price: 35900,
        categories: ["ночной", "восточный"],
        image: "assets/images/reinedenuit.jpg"
    },
    {
        id: 4,
        name: "Dolce&Gabbana The Only One 2",
        description: "Ягодная романтика с кофейной глубиной и тёплой, дорогой базой",
        price: 7500,
        categories: ["ночной", "сладкий"],
        image: "assets/images/theonlyone.jpg"
    },
    {
        id: 5,
        name: "The House of Oud Empathy",
        description: "Немного малины, табак, много уда и мокрых деревяшек",
        price: 18900,
        categories: ["свежий", "цветочный"],
        image: "assets/images/empathy.jpg"
    },
    {
        id: 6,
        name: "Parfums de Marly Delina Exclusif",
        description: "Нежный цветочный женский аромат",
        price: 29500,
        categories: ["цветочный", "сладкий"],
        image: "assets/images/delinaexl.jpg"
    },
    {
        id: 7,
        name: "Guerlain Rose Cherie",
        description: "Сладкий чувственный аромат с розой",
        price: 49800,
        categories: ["цветочный", "восточный"],
        image: "assets/images/rosecherie.jpg"
    },
    {
        id: 8,
        name: "Laurent Mazzone Sensual Orchid",
        description: "Ванильный восточный аромат",
        price: 21700,
        categories: ["сладкий", "цветочный"],
        image: "assets/images/sensualorchid.jpg"
    },
    {
        id: 9,
        name: "Gritti Adele",
        description: "Аромат с османтусом и жасмином",
        price: 14900,
        categories: ["восточный", "цветочный"],
        image: "assets/images/adele.jpg"
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM элементы
const productsContainer = document.getElementById('productsContainer');
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const cartItems = document.getElementById('cartItems');
const cartTotalItems = document.getElementById('cartTotalItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const resetFiltersBtn = document.getElementById('resetFilters');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartCount();
    setupEventListeners();
});

// Рендер товаров
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>Товары не найдены</h4>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-4 fade-in';
    
    const categoriesHtml = product.categories.map(cat => {
        const className = getCategoryClass(cat);
        return `<span class="category-badge ${className}">${cat}</span>`;
    }).join('');
    
    col.innerHTML = `
        <div class="card h-100">
            <div class="position-relative">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x250?text=Perfume'">
                <div class="position-absolute top-0 end-0 p-2">
                    <button class="btn btn-sm btn-outline-danger btn-favorite" data-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <div class="mb-3">${categoriesHtml}</div>
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">${product.price.toLocaleString()} ₽</span>
                        <button class="btn btn-danger add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus me-1"></i> В корзину
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Получение класса для категории
function getCategoryClass(category) {
    const classes = {
        'цветочный': 'category-floral',
        'сладкий': 'category-sweet',
        'восточный': 'category-oriental',
        'свежий': 'category-fresh',
        'ночной': 'category-night'

    };
    return classes[category] || '';
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Добавление в корзину
    productsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const productId = parseInt(button.dataset.id);
            addToCart(productId);
            
            // Анимация кнопки
            button.innerHTML = '<i class="fas fa-check me-1"></i> Добавлено';
            button.classList.remove('btn-danger');
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-cart-plus me-1"></i> В корзину';
                button.classList.remove('btn-success');
                button.classList.add('btn-danger');
            }, 1500);
        }
        
        if (e.target.closest('.btn-favorite')) {
            const button = e.target.closest('.btn-favorite');
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            icon.classList.toggle('text-danger');
        }
    });
    
    // Открытие корзины
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        cartModal.show();
    });
    
    // Очистка корзины
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
        }
    });
    
    // Оформление заказа
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Заказ оформлен! Сумма: ${total.toLocaleString()} ₽\nСпасибо за покупку!`);
        
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        cartModal.hide();
    });
    
    // Фильтрация
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    resetFiltersBtn.addEventListener('click', resetFilters);
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Уведомление
    showNotification(`${product.name} добавлен в корзину!`);
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Обновление счетчика корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'block';
    } else {
        cartCount.style.display = 'none';
    }
}

// Рендер корзины
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartTotalItems.textContent = '0';
        cartTotalPrice.textContent = '0 ₽';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    let totalItems = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" 
                 onerror="this.src='https://via.placeholder.com/80x80?text=Perfume'">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
            </div>
            <div class="remove-btn ms-3" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotalItems.textContent = totalItems;
    cartTotalPrice.textContent = totalPrice.toLocaleString() + ' ₽';
    
    // Добавляем обработчики для кнопок в корзине
    cartItems.addEventListener('click', (e) => {
        const id = parseInt(e.target.closest('[data-id]')?.dataset.id);
        if (!id) return;
        
        if (e.target.closest('.increase-quantity')) {
            changeQuantity(id, 1);
        } else if (e.target.closest('.decrease-quantity')) {
            changeQuantity(id, -1);
        } else if (e.target.closest('.remove-btn')) {
            removeFromCart(id);
        }
    });
}

// Изменение количества товара
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        renderCart();
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

// Фильтрация товаров
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const selectedPrice = priceFilter.value;
    
    let filteredProducts = products.filter(product => {
        // Поиск по названию
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        
        // Фильтр по категории
        const matchesCategory = !selectedCategory || 
                               product.categories.some(cat => cat.toLowerCase() === selectedCategory);
        
        // Фильтр по цене
        let matchesPrice = true;
        if (selectedPrice) {
            const [min, max] = selectedPrice.split('-').map(Number);
            matchesPrice = product.price >= min && product.price <= max;
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    renderProducts(filteredProducts);
}

// Сброс фильтров
function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    priceFilter.value = '';
    renderProducts(products);
}

// Показать уведомление
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white rounded shadow-lg';
    notification.style.zIndex = '1060';
    notification.style.minWidth = '250px';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}