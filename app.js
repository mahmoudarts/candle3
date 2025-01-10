// App.js
document.addEventListener('DOMContentLoaded', function() {
    // Dummy data for the example
    const products = [
        { id: 1, name: 'Candle A', price: 15.00, costPrice: 5.00, materials: 'Wax, Wick, Dye' },
        { id: 2, name: 'Candle B', price: 20.00, costPrice: 7.00, materials: 'Wax, Wick, Dye, Fragrance' }
    ];

    // Display products in the table
    function loadProducts() {
        const tableBody = document.querySelector('#products-table tbody');
        tableBody.innerHTML = '';
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

    // Handle adding new product
    document.querySelector('#add-product-btn').addEventListener('click', function() {
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

    // Edit product
    window.editProduct = function(id) {
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

    // Delete product
    window.deleteProduct = function(id) {
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex > -1) {
            products.splice(productIndex, 1);
            loadProducts();
        }
    };

    // Initial load
    loadProducts();
});
