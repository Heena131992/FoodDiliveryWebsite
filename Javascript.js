const initApp = () => {
    fetch('https://foodie-dashboard.pages.dev/api/products')
        .then(response => response.json())
        .then(data => {
            productList = data
                .filter(item => item.isAvailable)
                .map(item => ({
                    id: item.id,
                    name: item.name,
                    price: `$${Number(item.price).toFixed(2)}`,
                    images: item.image
                }));
            showCards();
        })
        .catch(error => {
            console.error('Products load error:', error);
        });
};



// 1. MOBILE MENU TOGGLE
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.toggle('mobile-menu-active');
    });
}

// 2. SWIPER SLIDER
var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: '.next-arrow',
        prevEl: '.prev-arrow',
    },
});

// 3. CART ELEMENTS & STATE
const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list'); // Fixed: Missing variable added
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');

let productList = [];
let cartProduct = [];

// Open & Close Cart Sidebar
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartTab.classList.add('cart-tab-active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartTab.classList.remove('cart-tab-active');
    });
}

// 4. UPDATE CART TOTALS
const updateTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;

    document.querySelectorAll('.item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-value').textContent);
        const price = parseFloat(item.querySelector('.total-item').textContent.replace('$', ''));
        totalPrice += price;
        totalQuantity += quantity;
    });

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQuantity;
};

// Helper: Image path ko safe tarike se nikalne ke liye (chahe JSON me 'images' ho ya 'image', ya 'images/' folder missing ho)
const getProductImage = (product) => {
    let imgPath = product.images || product.image || product.img || 'images/burger.png';
    if (!imgPath.startsWith('http') && !imgPath.startsWith('images/') && !imgPath.startsWith('./')) {
        imgPath = 'images/' + imgPath;
    }
    return imgPath;
};

// 5. RENDER MENU CARDS
const showCards = () => {
    cardList.innerHTML = '';

    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        const imgSrc = getProductImage(product);

        orderCard.innerHTML = `
            <div class="card-image">
                <img src="${imgSrc}" alt="${product.name}" onerror="this.src='images/burger.png'">
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="#" class="btn card-btn">Add to Cart</a>
        `;

        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);
        });
    });
};

// 6. FETCH PRODUCTS FROM JSON
const initApp = () => {
    fetch('./products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('products.json file nahi mili');
            }
            return response.json();
        })
        .then(data => {
            productList = data;
            showCards();
        })
        .catch(error => {
            console.error('Products load error:', error);
            cardList.innerHTML = `<p style="color: red;">Menu load nahi ho paya. Kripya Live Server ya Localhost par website chalayein.</p>`;
        });
};

initApp();

// 7. ADD TO CART FUNCTION
const addToCart = (product) => {
    const existingProduct = cartProduct.find(item => item.id === product.id);
    if (existingProduct) {
        alert('Item already in your cart!');
        cartTab.classList.add('cart-tab-active');
        return;
    }

    cartProduct.push(product);

    let quantity = 1;
    let price = parseFloat(String(product.price).replace('$', ''));
    const imgSrc = getProductImage(product);

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${imgSrc}" alt="${product.name}" onerror="this.src='images/burger.png'">
        </div>
        <div class="item-details detail">
            <h4>${product.name}</h4>
            <h4 class="total-item">$${price.toFixed(2)}</h4>
        </div>
        <div class="flex">
            <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>
        </div>
    `;

    cartList.appendChild(cartItem);
    updateTotals();
    cartTab.classList.add('cart-tab-active'); // Item add hote hi cart khul jayega

    const plusBtn = cartItem.querySelector('.plus');
    const minusBtn = cartItem.querySelector('.minus');
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.total-item');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
        updateTotals();
    });

    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
            updateTotals();
        } else {
            cartItem.classList.add('slide-out');
            setTimeout(() => {
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateTotals();
            }, 300);
        }
    });
};

// 8. CHECKOUT & ORDER SUCCESS LOGIC
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const modalTotalAmount = document.getElementById('modalTotalAmount');
const successPopup = document.getElementById('successPopup');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const randomOrderIdSpan = document.getElementById('randomOrderId');

document.querySelector('.checkout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const currentTotal = cartTotal.textContent;

    if (currentTotal === '$0.00' || cartProduct.length === 0) {
        alert('Your cart is empty! Add some delicious food first.');
        return;
    }

    modalTotalAmount.textContent = currentTotal;
    cartTab.classList.remove('cart-tab-active');
    checkoutModal.classList.add('active');
});

closeCheckoutBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
    if (e.target === signinModal) {
        signinModal.classList.remove('active');
    }
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkoutModal.classList.remove('active');

    const randomID = '#FD' + Math.floor(100000 + Math.random() * 900000);
    randomOrderIdSpan.textContent = randomID;

    successPopup.classList.add('active');
    clearCartData();
});

closeSuccessBtn.addEventListener('click', () => {
    successPopup.classList.remove('active');
});

function clearCartData() {
    if (cartList) cartList.innerHTML = '';
    if (cartValue) cartValue.textContent = '0';
    if (cartTotal) cartTotal.textContent = '$0.00';
    cartProduct = []; // Fixed: Array bhi empty hoga taaki dobara add kar sakein
    checkoutForm.reset();
}

// 9. SIGN IN & LOGOUT LOGIC (Desktop + Mobile dono buttons ke liye)
const signinTriggers = document.querySelectorAll('.signin-trigger');
const signinModal = document.getElementById('signinModal');
const closeSigninBtn = document.getElementById('closeSignin');
const signinForm = document.getElementById('signinForm');

signinTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.remove('mobile-menu-active');

        if (localStorage.getItem('isLoggedIn') === 'true') {
            logoutUser();
        } else {
            signinModal.classList.add('active');
        }
    });
});

closeSigninBtn.addEventListener('click', () => {
    signinModal.classList.remove('active');
});

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    try {
        const response = await fetch('http://localhost/foodie-backend/signin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
            localStorage.setItem('isLoggedIn', 'true'); // Fixed: Login state save
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data.userId);

            alert('🎉 ' + data.message);
            updateUIForLoggedInUser();
            signinModal.classList.remove('active');
            signinForm.reset();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Connection Error:', error);
        alert('❌ Connection Error! Please check if XAMPP/Server is running.');
    }
});

function updateUIForLoggedInUser() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        signinTriggers.forEach(btn => {
            btn.innerHTML = `Log Out &nbsp;<i class="fa-solid fa-right-from-bracket"></i>`;
            btn.style.background = 'var(--lead)';
        });
    }
}

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    alert('Logged out successfully.');

    signinTriggers.forEach(btn => {
        btn.innerHTML = `Sign in &nbsp;<i class="fa-solid fa-right-from-bracket"></i>`;
        btn.style.background = 'var(--gold-finger)';
    });
}

// 10. NEWSLETTER FORM HANDLER
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('subscriberEmail');
        alert(`Thank you for subscribing with ${emailInput.value}!`);
        newsletterForm.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateUIForLoggedInUser();
});


