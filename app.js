// Fetch products from the server and display them
document.addEventListener('DOMContentLoaded', function() {
    // Fetch products for the inventory page
    fetch('/products')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#inventory-table tbody');
            data.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.costPrice}</td>
                    <td>${product.materials}</td>
                    <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching products:', error));

    // Handle form submission to add a new product
    const form = document.querySelector('#addProductForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const productData = {
            name: document.querySelector('#product-name').value,
            price: parseFloat(document.querySelector('#product-price').value),
            costPrice: parseFloat(document.querySelector('#product-cost-price').value),
            materials: document.querySelector('#product-materials').value
        };

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Product added successfully!');
            window.location.reload();
        })
        .catch(error => console.error('Error adding product:', error));
    });

    // Similarly, handle adding and displaying raw materials and orders...
});
