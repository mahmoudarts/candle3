document.addEventListener('DOMContentLoaded', function () {
    // Initialize mock data
    const products = [
        { id: 1, name: 'Candle A', price: 15.00, costPrice: 5.00, materials: 'Wax, Wick, Dye' },
        { id: 2, name: 'Candle B', price: 20.00, costPrice: 7.00, materials: 'Wax, Wick, Dye, Fragrance' }
    ];

    const orders = [
        { id: 1, clientName: 'John Doe', phone: '123-456-7890', email: 'john@example.com', items: 'Candle A', price: 15.00, quantity: 2, totalPrice: 30.00 },
        { id: 2, clientName: 'Jane Smith', phone: '987-654-3210', email: 'jane@example.com', items: 'Candle B', price: 20.00, quantity: 1, totalPrice: 20.00 }
    ];

    // Function to load products into the inventory table
    function loadProducts() {
        const tableBody = document.querySelector('#products-table tbody');
        tableBody.innerHTML = ''; // Clear existing table rows

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.costPrice}</td>
                <td>${product.materials}</td>
                <td>
                    <button class="btn btn-warning" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to handle adding a new product
    document.querySelector('#add-product-btn').addEventListener('click', function () {
        const productName = prompt('Enter product name:');
        const productPrice = parseFloat(prompt('Enter product price:'));
        const productCostPrice = parseFloat(prompt('Enter product cost price:'));
        const productMaterials = prompt('Enter materials used (comma separated):');

        const newProduct = {
            id: products.length + 1,
            name: productName,
            price: productPrice,
            costPrice: productCostPrice,
            materials: productMaterials
        };

        products.push(newProduct);
        loadProducts();
    });

    // Function to edit a product
    window.editProduct = function (id) {
        const product = products.find(p => p.id === id);
        if (product) {
            const newName = prompt('Edit product name:', product.name);
            const newPrice = parseFloat(prompt('Edit product price:', product.price));
            const newCostPrice = parseFloat(prompt('Edit product cost price:', product.costPrice));
            const newMaterials = prompt('Edit materials used (comma separated):', product.materials);

            product.name = newName;
            product.price = newPrice;
            product.costPrice = newCostPrice;
            product.materials = newMaterials;
            loadProducts();
        }
    };

    // Function to delete a product
    window.deleteProduct = function (id) {
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex > -1) {
            products.splice(productIndex, 1);
            loadProducts();
        }
    };

    // Function to load orders into the orders table
    function loadOrders() {
        const tableBody = document.querySelector('#orders-table tbody');
        tableBody.innerHTML = ''; // Clear existing table rows

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.clientName}</td>
                <td>${order.email}</td>
                <td>${order.items}</td>
                <td>${order.totalPrice}</td>
                <td>
                    <button class="btn btn-info" onclick="downloadInvoice(${order.id})">Download Invoice</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to handle downloading the invoice
    window.downloadInvoice = function (orderId) {
        const invoiceUrl = `http://localhost:3000/api/invoice/${orderId}`;
        window.location.href = invoiceUrl;  // Triggers PDF download
    };

    // Function to handle adding a new order
    document.querySelector('#add-order-btn').addEventListener('click', function () {
        const clientName = prompt('Enter client name:');
        const phone = prompt('Enter phone number:');
        const email = prompt('Enter email address:');
        const items = prompt('Enter items (comma separated):');
        const price = parseFloat(prompt('Enter price per item:'));
        const quantity = parseInt(prompt('Enter quantity of items:'));
        const totalPrice = price * quantity;

        const newOrder = {
            id: orders.length + 1,
            clientName,
            phone,
            email,
            items,
            price,
            quantity,
            totalPrice
        };

        orders.push(newOrder);
        loadOrders();
    });

    // Initial load of products and orders
    loadProducts();
    loadOrders();
});
