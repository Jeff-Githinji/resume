// Declare the cart variable only once
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Initialize cart from local storage or as an empty array

document.addEventListener('DOMContentLoaded', () => {
    let currentLocation = window.location.href;
    let links = document.querySelectorAll('.navbar nav ul li a');
    
    links.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            links.forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});

// Cart function
function addToCart(productName, price, quantity) {
    const item = {
        name: productName,
        price: price,
        quantity: parseInt(quantity)
    };

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === productName);

    if (existingItemIndex > -1) {
        // If it exists, update the quantity
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // If it doesn't exist, add it to the cart
        cart.push(item);
    }

    alert(`${productName} has been added to your cart!`);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to local storage
}





