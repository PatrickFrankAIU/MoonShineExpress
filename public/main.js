// Check for dark mode preference on page load
window.onload = () => {
    let darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('darkMode');
        let darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = true; // Set the toggle position to match
        }
    }
};

// Toggle Dark Mode
const toggleDarkMode = () => {
    document.body.classList.toggle('darkMode');
    // Store the theme preference in localStorage
    let darkModeEnabled = document.body.classList.contains('darkMode');
    localStorage.setItem('darkMode', darkModeEnabled); // Save the preference
};

// Shopping Cart Functionality

// Global variables
let cart = [];
let TAX_RATE = 0.0725; // 7.25% sales tax

// Initialize cart from session storage on page load
const initCart = () => {
    let savedCart = sessionStorage.getItem('lunarSparkleCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
};

// Save cart to session storage
const saveCart = () => {
    sessionStorage.setItem('lunarSparkleCart', JSON.stringify(cart));
    updateCartCount();
};

// Update cart count display
const updateCartCount = () => {
    let cartCount = document.getElementById('cartCount');
    if (cartCount) {
        let totalItems = 0;
        
        // Calculate total items
        for (let i = 0; i < cart.length; i++) {
            totalItems = totalItems + cart[i].quantity;
        }
        
        cartCount.textContent = totalItems;
        
        // Make count visible only if there are items
        if (totalItems > 0) {
            cartCount.style.display = 'inline-block';
        } else {
            cartCount.style.display = 'none';
        }
    }
};

// Add item to cart
const addToCart = (productId, name, price, image) => {
    // Check if product already in cart
    let existingItemIndex = -1;
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            existingItemIndex = i;
            break;
        }
    }
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = cart[existingItemIndex].quantity + 1;
    } else {
        let newItem = {
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        };
        cart.push(newItem);
    }
    
    saveCart();
    
    // Show confirmation message
    let confirmMessage = document.getElementById('cartConfirmation');
    if (confirmMessage) {
        confirmMessage.textContent = 'Added "' + name + '" to your cart!';
        confirmMessage.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            confirmMessage.style.display = 'none';
        }, 3000);
    }
};

// Remove item from cart
const removeFromCart = (productId) => {
    let newCart = [];
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    
    cart = newCart;
    saveCart();
    
    // If on cart page, update the display
    if (window.location.href.includes('cart.html')) {
        displayCart();
    }
};

// Update item quantity
const updateQuantity = (productId, newQuantity) => {
    let numQuantity = parseInt(newQuantity);
    
    // Make sure quantity is a number and at least 1
    if (isNaN(numQuantity) || numQuantity < 1) {
        numQuantity = 1;
    }
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = numQuantity;
            break;
        }
    }
    
    saveCart();
    
    // If on cart page, update the display
    if (window.location.href.includes('cart.html')) {
        displayCart();
    }
};

// Calculate subtotal
const calculateSubtotal = () => {
    let subtotal = 0;
    
    for (let i = 0; i < cart.length; i++) {
        subtotal = subtotal + (cart[i].price * cart[i].quantity);
    }
    
    return subtotal;
};

// Calculate tax
const calculateTax = (subtotal) => {
    return subtotal * TAX_RATE;
};

// Calculate total
const calculateTotal = () => {
    let subtotal = calculateSubtotal();
    let tax = calculateTax(subtotal);
    return subtotal + tax;
};

// Display cart on cart page
const displayCart = () => {
    let cartContainer = document.getElementById('cartItems');
    let subtotalElement = document.getElementById('subtotal');
    let taxElement = document.getElementById('tax');
    let totalElement = document.getElementById('total');
    
    if (!cartContainer) {
        return;
    }
    
    // Clear current cart display
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        let emptyCartMessage = document.createElement('p');
        emptyCartMessage.className = 'empty-cart';
        emptyCartMessage.textContent = 'Your cart is empty.';
        cartContainer.appendChild(emptyCartMessage);
        
        // Clear totals
        if (subtotalElement) {
            subtotalElement.textContent = '$0.00';
        }
        if (taxElement) {
            taxElement.textContent = '$0.00';
        }
        if (totalElement) {
            totalElement.textContent = '$0.00';
        }
        
        // Hide checkout button
        let checkoutBtn = document.getElementById('checkoutButton');
        if (checkoutBtn) {
            checkoutBtn.style.display = 'none';
        }
        
        return;
    }
    
    // Display each cart item
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        
        let cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Create image container
        let imageDiv = document.createElement('div');
        imageDiv.className = 'cart-item-image';
        
        let img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        imageDiv.appendChild(img);
        
        // Create details container
        let detailsDiv = document.createElement('div');
        detailsDiv.className = 'cart-item-details';
        
        // Add item name
        let itemName = document.createElement('h3');
        itemName.textContent = item.name;
        detailsDiv.appendChild(itemName);
        
        // Add item price
        let itemPrice = document.createElement('p');
        itemPrice.className = 'cart-item-price';
        itemPrice.textContent = '$' + item.price.toFixed(2);
        detailsDiv.appendChild(itemPrice);
        
        // Add quantity controls
        let quantityDiv = document.createElement('div');
        quantityDiv.className = 'cart-item-quantity';
        
        // Decrease button
        let decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'quantity-btn';
        decreaseBtn.textContent = '-';
        decreaseBtn.onclick = () => {
            updateQuantity(item.id, item.quantity - 1);
        };
        quantityDiv.appendChild(decreaseBtn);
        
        // Quantity input
        let quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = '1';
        quantityInput.onchange = () => {
            updateQuantity(item.id, quantityInput.value);
        };
        quantityDiv.appendChild(quantityInput);
        
        // Increase button
        let increaseBtn = document.createElement('button');
        increaseBtn.className = 'quantity-btn';
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => {
            updateQuantity(item.id, item.quantity + 1);
        };
        quantityDiv.appendChild(increaseBtn);
        
        detailsDiv.appendChild(quantityDiv);
        
        // Add item total
        let itemTotal = document.createElement('p');
        itemTotal.className = 'cart-item-total';
        itemTotal.textContent = 'Total: $' + (item.price * item.quantity).toFixed(2);
        detailsDiv.appendChild(itemTotal);
        
        // Add remove button
        let removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            removeFromCart(item.id);
        };
        detailsDiv.appendChild(removeBtn);
        
        // Append all elements to cart item
        cartItem.appendChild(imageDiv);
        cartItem.appendChild(detailsDiv);
        
        // Add to cart container
        cartContainer.appendChild(cartItem);
    }
    
    // Update totals
    let subtotal = calculateSubtotal();
    let tax = calculateTax(subtotal);
    let total = subtotal + tax;
    
    if (subtotalElement) {
        subtotalElement.textContent = '$' + subtotal.toFixed(2);
    }
    if (taxElement) {
        taxElement.textContent = '$' + tax.toFixed(2);
    }
    if (totalElement) {
        totalElement.textContent = '$' + total.toFixed(2);
    }
    
    // Show checkout button
    let checkoutBtn = document.getElementById('checkoutButton');
    if (checkoutBtn) {
        checkoutBtn.style.display = 'block';
    }
};

// Process checkout - UPDATED to use the server API with async/await
const processCheckout = async () => {
    // Get form data
    let name = document.getElementById('customerName').value;
    let email = document.getElementById('customerEmail').value;
    let address = document.getElementById('customerAddress').value;
    
    // Basic validation
    if (!name || !email || !address) {
        alert('Please fill out all required fields.');
        return false;
    }
    
    // Prepare order data for API
    let orderData = {
        customer: {
            name: name,
            email: email,
            address: address
        },
        items: JSON.parse(JSON.stringify(cart)), // Make a copy of the cart
        totals: {
            subtotal: calculateSubtotal(),
            tax: calculateTax(calculateSubtotal()),
            total: calculateTotal()
        }
    };
    
    try {
        // Send order to server API
        let response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        let data = await response.json();
        
        // Store order info in session storage for confirmation page
        let orderConfirmation = {
            orderId: data.orderId,
            trackingNumber: data.trackingNumber,
            customer: orderData.customer,
            items: orderData.items,
            totals: orderData.totals,
            orderDate: new Date().toISOString()
        };
        
        sessionStorage.setItem('lunarSparkleLastOrder', JSON.stringify(orderConfirmation));
        
        // Clear cart
        cart = [];
        saveCart();
        
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    } catch (error) {
        console.error('Error creating order:', error);
        alert('There was a problem processing your order. Please try again.');
    }
    
    return false; // Prevent form submission
};

// Display order confirmation
const displayOrderConfirmation = (order) => {
    // Display order information
    document.getElementById('confirmationName').textContent = order.customer.name;
    document.getElementById('confirmationEmail').textContent = order.customer.email;
    document.getElementById('confirmationAddress').textContent = order.customer.address;
    document.getElementById('trackingNumber').textContent = order.trackingNumber;
    
    // Format the date
    let orderDate = new Date(order.orderDate);
    let formattedDate = (orderDate.getMonth() + 1) + '/' + orderDate.getDate() + '/' + orderDate.getFullYear();
    document.getElementById('orderDate').textContent = formattedDate;
    
    // Display ordered items
    let itemsContainer = document.getElementById('orderedItems');
    itemsContainer.innerHTML = ''; // Clear any existing content
    
    for (let i = 0; i < order.items.length; i++) {
        let item = order.items[i];
        
        let orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        // Create image container
        let imageDiv = document.createElement('div');
        imageDiv.className = 'order-item-image';
        
        let img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        imageDiv.appendChild(img);
        
        // Create details container
        let detailsDiv = document.createElement('div');
        detailsDiv.className = 'order-item-details';
        
        // Add item name
        let itemName = document.createElement('h3');
        itemName.textContent = item.name;
        detailsDiv.appendChild(itemName);
        
        // Add quantity
        let quantity = document.createElement('p');
        quantity.textContent = 'Quantity: ' + item.quantity;
        detailsDiv.appendChild(quantity);
        
        // Add price
        let price = document.createElement('p');
        price.textContent = 'Price: $' + item.price.toFixed(2);
        detailsDiv.appendChild(price);
        
        // Add item total
        let total = document.createElement('p');
        total.textContent = 'Item Total: $' + (item.price * item.quantity).toFixed(2);
        detailsDiv.appendChild(total);
        
        // Append all elements to order item
        orderItem.appendChild(imageDiv);
        orderItem.appendChild(detailsDiv);
        
        // Add to items container
        itemsContainer.appendChild(orderItem);
    }
    
    // Display totals
    document.getElementById('confirmationSubtotal').textContent = '$' + order.totals.subtotal.toFixed(2);
    document.getElementById('confirmationTax').textContent = '$' + order.totals.tax.toFixed(2);
    document.getElementById('confirmationTotal').textContent = '$' + order.totals.total.toFixed(2);
};

// Load order confirmation details - UPDATED to use async/await
const loadOrderConfirmation = async () => {
    let orderData = sessionStorage.getItem('lunarSparkleLastOrder');
    
    if (!orderData) {
        // Instead of redirecting, display a message about checking orders
        document.querySelector('.confirmation-header h2').textContent = 'Order Tracking';
        document.querySelector('.confirmation-message').textContent = 
            'No recent order found in this session. You can look up any order using the tracking number below.';
        
        // Hide order details sections
        document.querySelector('.confirmation-details').style.display = 'none';
        document.querySelector('.order-summary').style.display = 'none';
        
        // Focus on the tracking section
        document.querySelector('.tracking-section').scrollIntoView();
        document.getElementById('lookupTrackingNumber').focus();
        return;
    }
    
    let order = JSON.parse(orderData);
    
    try {
        // Fetch the full order details from the server using the tracking number
        let response = await fetch('/api/orders/' + order.trackingNumber);
        
        if (!response.ok) {
            // Use the data from session storage if API request fails
            displayOrderConfirmation(order);
            return;
        }
        
        let serverOrder = await response.json();
        displayOrderConfirmation(serverOrder);
    } catch (error) {
        // Use the session storage data if there's an error
        console.error('Error fetching order details:', error);
        displayOrderConfirmation(order);
    }
};

// Load products from API for the products page
const loadProducts = async () => {
    try {
        let response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        let products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.querySelector('.jewelry-container.products').innerHTML = 
            '<p class="error-message">Failed to load products. Please try again later.</p>';
    }
};

// Display products on the products page
const displayProducts = (products) => {
    let productsContainer = document.querySelector('.jewelry-container.products');
    
    if (!productsContainer) {
        return;
    }
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    // Display each product
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        
        let productCard = document.createElement('div');
        productCard.className = 'productCard';
        productCard.setAttribute('data-id', product.id);
        productCard.setAttribute('data-name', product.name);
        productCard.setAttribute('data-price', product.price);
        productCard.setAttribute('data-image', product.image);
        
        // Product image
        let productImg = document.createElement('img');
        productImg.className = 'jewelry';
        productImg.src = product.image;
        productImg.alt = product.name;
        productCard.appendChild(productImg);
        
        // Product description
        let productDesc = document.createElement('p');
        productDesc.textContent = product.description;
        productCard.appendChild(productDesc);
        
        // Product price
        let productPrice = document.createElement('p');
        productPrice.className = 'price';
        productPrice.textContent = '$' + product.price.toFixed(2);
        productCard.appendChild(productPrice);
        
        // Add to cart button
        let addButton = document.createElement('button');
        addButton.className = 'add-to-cart-btn';
        addButton.textContent = 'Add to Cart';
        productCard.appendChild(addButton);
        
        // Add to container
        productsContainer.appendChild(productCard);
    }
    
    // Add event listeners to the Add to Cart buttons
    let addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    for (let i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener('click', () => {
            let productCard = addToCartButtons[i].closest('.productCard');
            let productId = productCard.getAttribute('data-id');
            let productName = productCard.getAttribute('data-name');
            let productPrice = parseFloat(productCard.getAttribute('data-price'));
            let productImage = productCard.getAttribute('data-image');
            
            addToCart(productId, productName, productPrice, productImage);
        });
    }
};

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    // Check if on products page
    if (window.location.href.includes('products.html')) {
        loadProducts();
    }
    
    // Check if on cart page
    if (window.location.href.includes('cart.html')) {
        displayCart();
        
        // Set up checkout form event listeners
        let checkoutButton = document.getElementById('checkoutButton');
        let checkoutForm = document.getElementById('checkoutForm');
        let cancelCheckoutButton = document.getElementById('cancel-checkout-btn');
        let paymentMethodSelect = document.getElementById('paymentMethod');
        
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                document.getElementById('checkoutForm').style.display = 'block';
            });
        }
        
        if (cancelCheckoutButton) {
            cancelCheckoutButton.addEventListener('click', () => {
                document.getElementById('checkoutForm').style.display = 'none';
            });
        }
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (event) => {
                event.preventDefault();
                processCheckout();
            });
        }
        
        if (paymentMethodSelect) {
            paymentMethodSelect.addEventListener('change', () => {
                let creditCardFields = document.getElementById('creditCardFields');
                if (paymentMethodSelect.value === 'credit') {
                    creditCardFields.style.display = 'block';
                } else {
                    creditCardFields.style.display = 'none';
                }
            });
        }
    }
    
    // Check if on confirmation page
    if (window.location.href.includes('confirmation.html')) {
        loadOrderConfirmation();
        
        // Set up tracking form event listener
        let trackingForm = document.getElementById('tracking-form');
        
        if (trackingForm) {
            trackingForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                let trackingNumber = document.getElementById('lookupTrackingNumber').value.trim();
                
                if (!trackingNumber) {
                    document.getElementById('tracking-result').innerHTML = 
                        '<p class="tracking-error">Please enter a tracking number.</p>';
                    return;
                }
                
                try {
                    // Fetch order with the tracking number
                    let response = await fetch('/api/orders/' + trackingNumber);
                    
                    if (!response.ok) {
                        throw new Error('Order not found');
                    }
                    
                    let order = await response.json();
                    
                    // Display order status
                    let statusHtml = '<div class="status-card">';
                    statusHtml += '<h4>Order Status: <span class="status-' + order.status.toLowerCase() + '">';
                    statusHtml += order.status + '</span></h4>';
                    statusHtml += '<p>Order Date: ' + new Date(order.orderDate).toLocaleDateString() + '</p>';
                    statusHtml += '<p>Total Items: ' + order.items.length + '</p>';
                    statusHtml += '<p>Order Total: $' + order.totals.total.toFixed(2) + '</p>';
                    statusHtml += '</div>';
                        
                    document.getElementById('tracking-result').innerHTML = statusHtml;
                } catch (error) {
                    document.getElementById('tracking-result').innerHTML = 
                        '<p class="tracking-error">Order not found. Please check your tracking number.</p>';
                }
            });
        }
    }
});