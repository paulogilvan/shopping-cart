// Dados dos produtos
const products = [
    { id: 1, name: 'Camiseta', price: 29.99, image: 'assets/images/camisa.png' },
    { id: 2, name: 'Calça Jeans', price: 79.99, image: 'assets/images/calca.png' },
    { id: 3, name: 'Tênis', price: 129.99, image: 'assets/images/tenis.png' },
    { id: 4, name: 'Boné', price: 19.99, image: 'assets/images/bone.png' },
    { id: 4, name: 'Meia', price: 49.99, image: 'assets/images/meia.png' },
    { id: 4, name: 'Cueca', price: 39.90, image: 'assets/images/cueca.png' },
    { id: 4, name: 'Cinto Masculino', price: 97.90, image: 'assets/images/cinto.png' },
    { id: 4, name: 'Jaqueta', price: 139.99, image: 'assets/images/jaqueta.png' },
    { id: 4, name: 'Chinelo', price: 59.60, image: 'assets/images/chinelo.png' },
    { id: 4, name: 'Bermuda', price: 65.00, image: 'assets/images/bermuda.png' }
];

let cart = [];

// Funções de inicialização
function init() {
    displayProducts();
    loadCart();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('checkout-button').addEventListener('click', showCheckout);
    document.getElementById('checkout-form').addEventListener('submit', processOrder);
}

// Funções de exibição de produtos
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>R$ ${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            </div>
        `;
    });
}

// Funções do carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            if (existingItem.quantity >= 10) {
                showNotification('Limite máximo de 10 unidades por produto atingido.');
                return;
            }
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        showNotification('Produto adicionado ao carrinho!');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity < 1) {
            showNotification('Por favor, insira uma quantidade válida.');
            updateCart();
            return;
        }
        item.quantity = quantity;
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)}</span>
                <input type="number" value="${item.quantity}" min="1" max="10" onchange="updateQuantity(${item.id}, this.value)">
                <span>R$ ${itemTotal.toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `;
    });

    document.getElementById('total-price').textContent = total.toFixed(2);
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Funções de checkout
function showCheckout() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('shopping-cart').style.display = 'none';
    document.getElementById('checkout').style.display = 'block';
    displayOrderSummary();
}

function displayOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    let total = 0;

    orderSummary.innerHTML = '<h3>Resumo do Pedido</h3>';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderSummary.innerHTML += `
            <p>${item.name} x ${item.quantity} - R$ ${itemTotal.toFixed(2)}</p>
        `;
    });
    orderSummary.innerHTML += `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
}

function processOrder(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    // Aqui você poderia enviar os dados do pedido para um servidor
    console.log('Pedido processado:', { name, email, address, cart });

    showNotification('Pedido confirmado! Obrigado por sua compra.');
    cart = [];
    saveCart();
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// Função auxiliar
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar a aplicação
window.onload = init;