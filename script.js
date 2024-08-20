document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const categoryFilter = document.getElementById('category-filter');
    const paymentForm = document.getElementById('payment-form');
    const checkoutButton = document.getElementById('checkout-button');
    const paymentMessage = document.getElementById('payment-message');

    let products = [];
    let cart = [];
    let total = 0;

    const fetchProducts = async () => {
        try {
            const response = await fetch('data.json');
            products = await response.json();
            displayCategories();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const displayProducts = (filteredProducts) => {
        productList.innerHTML = '';
        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h3>${product.name}</h3>
                <p>Precio: $${product.price.toFixed(2)}</p>
                <button data-id="${product.id}" data-price="${product.price}">Agregar</button>
            `;
            productList.appendChild(productDiv);
        });

        document.querySelectorAll('#product-list button').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    };

    const displayCategories = () => {
        const categories = [...new Set(products.map(product => product.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        categoryFilter.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            const filteredProducts = selectedCategory ? 
                products.filter(product => product.category === selectedCategory) : 
                products;
            displayProducts(filteredProducts);
        });
    };

    const addToCart = (event) => {
        const button = event.target;
        const id = button.getAttribute('data-id');
        const price = parseFloat(button.getAttribute('data-price'));

        const productInCart = cart.find(item => item.id === id);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.push({ id, price, quantity: 1 });
        }

        updateCart();
    };

    const removeFromCart = (id) => {
        const productInCart = cart.find(item => item.id === id);
        if (productInCart) {
            if (productInCart.quantity > 1) {
                productInCart.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== id);
            }
            updateCart();
        }
    };

    const updateCart = () => {
        cartItems.innerHTML = '';
        total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                Codigo: ${item.id}, Cantidad: ${item.quantity}, Precio: $${(item.price * item.quantity).toFixed(2)}
                <button data-id="${item.id}" class="remove-button">Eliminar</button>
            `;
            cartItems.appendChild(listItem);
        });

        document.querySelectorAll('#cart-items .remove-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = button.getAttribute('data-id');
                removeFromCart(id);
            });
        });

        total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        totalPrice.textContent = total.toFixed(2);
    };

    const handleCheckout = () => {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        paymentMessage.textContent = `Compra finalizada. Método de pago: ${paymentMethod}.`;
    };

    checkoutButton.addEventListener('click', handleCheckout);

    fetchProducts();
});
