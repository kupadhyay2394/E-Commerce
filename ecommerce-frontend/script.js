document.addEventListener('DOMContentLoaded', () => {

    // --- API URLs ---
    const PRODUCT_API_URL = 'http://localhost:8080/api/products';
    const ORDER_API_URL = 'http://localhost:8080/api/orders';
    
    // --- Page Elements ---
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- Shop Page Elements ---
    const shopProductList = document.getElementById('shop-product-list');
    const orderList = document.getElementById('order-list');

    // --- Admin Page Elements ---
    const addProductForm = document.getElementById('add-product-form');
    const adminProductList = document.getElementById('admin-product-list');

    // --- Navigation ---
    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        // Deactivate all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Show the target page
        document.getElementById(pageId).classList.add('active');
        // Activate the target nav link
        document.getElementById(`nav-${pageId.split('-')[0]}`).classList.add('active');
    }

    document.getElementById('nav-shop').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('shop-page');
        fetchShopProducts(); // Reload data when switching to shop
        fetchOrders();
    });

    document.getElementById('nav-admin').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('admin-page');
        fetchAdminProducts(); // Reload data when switching to admin
    });

    // --- Shop Page Logic ---
    async function fetchShopProducts() {
        try {
            const response = await fetch(PRODUCT_API_URL);
            const products = await response.json();
            shopProductList.innerHTML = ''; // Clear
            
            if (products.length === 0) {
                shopProductList.innerHTML = '<p>No products available.</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                    <div style="text-align: right;">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <button class="buy-btn">Buy</button>
                    </div>
                `;
                card.querySelector('.buy-btn').addEventListener('click', () => buyProduct(product));
                shopProductList.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching shop products:', error);
            shopProductList.innerHTML = '<p style="color: red;">Error loading products.</p>';
        }
    }

    async function fetchOrders() {
        try {
            const response = await fetch(ORDER_API_URL);
            const orders = await response.json();
            orderList.innerHTML = ''; // Clear
            
            if (orders.length === 0) {
                orderList.innerHTML = '<p>You have not purchased any items.</p>';
                return;
            }

            // Show latest orders first
            orders.reverse().forEach(order => {
                const card = document.createElement('div');
                card.className = 'order-card';
                card.innerHTML = `
                    <div>
                        <h3>${order.productName}</h3>
                        <p>Purchased on: ${new Date(order.purchaseDate).toLocaleString()}</p>
                    </div>
                    <span class="price">$${order.priceAtPurchase.toFixed(2)}</span>
                `;
                orderList.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            orderList.innerHTML = '<p style="color: red;">Error loading orders.</p>';
        }
    }

    async function buyProduct(product) {
        if (!confirm(`Are you sure you want to buy ${product.name} for $${product.price}?`)) {
            return;
        }
        const orderRequest = {
            productId: product.id,
            productName: product.name,
            price: product.price
        };

        try {
            const response = await fetch(`${ORDER_API_URL}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderRequest),
            });
            if (response.ok) {
                alert(`Successfully purchased ${product.name}!`);
                fetchOrders(); // Refresh the order list
            } else {
                alert('Purchase failed.');
            }
        } catch (error) {
            console.error('Error purchasing product:', error);
        }
    }

    // --- Admin Page Logic ---
    async function fetchAdminProducts() {
        try {
            const response = await fetch(PRODUCT_API_URL);
            const products = await response.json();
            adminProductList.innerHTML = ''; // Clear
            
            if (products.length === 0) {
                adminProductList.innerHTML = '<p>No products in database.</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div>
                        <h3>${product.name}</h3>
                        <p>ID: ${product.id}</p>
                    </div>
                    <div style="text-align: right;">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;
                card.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product.id));
                adminProductList.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching admin products:', error);
            adminProductList.innerHTML = '<p style="color: red;">Error loading products.</p>';
        }
    }

    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const newProduct = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value)
        };

        try {
            const response = await fetch(PRODUCT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                addProductForm.reset();
                alert('Product added successfully!');
                fetchAdminProducts(); // Refresh the admin product list
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });
    
    async function deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchAdminProducts(); // Refresh the list
            } else {
                alert('Failed to delete product.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    // --- Initial Load ---
    showPage('shop-page');
    fetchShopProducts();
    fetchOrders();
});