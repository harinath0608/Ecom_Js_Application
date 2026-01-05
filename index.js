
    document.addEventListener('DOMContentLoaded', async () => {
        const productList = document.getElementById('product-list');
        const filterButtons = document.getElementById('filter-buttons');
        const cartCount = document.getElementById('cart-count');

        let allProducts = [];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Update cart count on page load
        updateCartCount();

        try {
            const response = await fetch('https://fakestoreapi.com/products');
            allProducts = await response.json();
            renderProducts(allProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<p class="text-center text-danger">Failed to load products. Please try again later.</p>';
        }

        filterButtons.addEventListener('click', (event) => {
            const button = event.target;
            if (button.tagName === 'BUTTON') {
                const category = button.getAttribute('data-category');

                // Remove active class from all buttons and add it to the clicked one
                document.querySelectorAll('#filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter products based on the category
                const filteredProducts = category === 'all'
                    ? allProducts
                    : allProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());

                renderProducts(filteredProducts);
            }
        });

        function renderProducts(products) {
            productList.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('col');

                productCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description.substring(0, 100)}...</p>
                            <p class="text-primary fw-bold">$${product.price}</p>
                            <button class="btn btn-outline-primary">Details</button>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                `;

                productList.appendChild(productCard);
            });

            // Attach event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = parseInt(event.target.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
        }

        function addToCart(productId) {
            const product = allProducts.find(p => p.id === productId);

            // Check if the product is already in the cart
            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            // Save the cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Update cart count
            updateCartCount();
        }

        function updateCartCount() {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    });

