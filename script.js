// Initialize products array with sample data
let products = JSON.parse(localStorage.getItem('judaicaProducts')) || [
    {
        id: 1,
        title: 'מזוזה בעבודת יד',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb6f3c1d?w=400&h=300&fit=crop'
    },
    {
        id: 2,
        title: 'מנורה כספ - 7 ענפים',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=300&fit=crop'
    },
    {
        id: 3,
        title: 'מצביע תורה (יד)',
        price: 35.50,
        image: 'https://images.unsplash.com/photo-1609269585289-03519db621a3?w=400&h=300&fit=crop'
    },
    {
        id: 4,
        title: 'כיסוי חלה - רקום',
        price: 28.99,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop'
    }
];

let nextId = Math.max(...products.map(p => p.id), 0) + 1;

// DOM Elements
const productForm = document.getElementById('productForm');
const productsGrid = document.getElementById('productsGrid');

// Event Listeners
productForm.addEventListener('submit', handleAddProduct);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

// Handle adding a new product
function handleAddProduct(e) {
    e.preventDefault();

    const title = document.getElementById('productTitle').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();

    if (!title || isNaN(price) || price < 0) {
        alert('אנא מלא את כל השדות הנדרשים בערכים תקפים.');
        return;
    }

    const newProduct = {
        id: nextId++,
        title: title,
        price: price,
        image: image || null
    };

    products.push(newProduct);
    saveProducts();
    renderProducts();

    // Reset form
    productForm.reset();

    // Scroll to products section
    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
}

// Render all products
function renderProducts() {
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <p>אין מוצרים עדיין. הוסף את פריט יהודאיקה הראשון שלך במעלה!</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');

    // Add event listeners to remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeProduct(productId);
        });
    });
}

// Create a product card HTML
function createProductCard(product) {
    const imageHTML = product.image
        ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" onerror="this.style.display='none';">`
        : `<span>✡</span>`;

    return `
        <div class="product-card">
            <div class="product-image">
                ${imageHTML}
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(product.title)}</h3>
                <div class="product-price">₪${product.price.toFixed(2)}</div>
                <button class="btn-remove" data-id="${product.id}">הסר</button>
            </div>
        </div>
    `;
}

// Remove a product
function removeProduct(productId) {
    if (confirm('האם אתה בטוח שברצונך להסיר מוצר זה?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProducts();
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('judaicaProducts', JSON.stringify(products));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
