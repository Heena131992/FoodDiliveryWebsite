




// JavaScript for mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu-active');
});


// slider for destop and mobile
var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: '.fa-arrow-right',
        prevEl: '.fa-arrow-left',
    },
});

//Bag icon ke click par show karana hai

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
// const cartTotal = document.querySelector('.cart-total');
// const cartValue = document.querySelector('.cart-value');

//event lagega carticon and carttab par

cartIcon.addEventListener('click', () =>
    cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () => cartTab.classList.remove('cart-tab-active'));

//hamburg
hamburger.addEventListener('click',()=> mobileMenu.classList.toggle('.mobile-menu-active'));

//fetch the data


let productList = [];

let cartProduct = [];



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



const showCards = () => {
    productList.forEach(product => {

        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `<div class="card-image">
                        <img src="${product.image}">
                    </div>

                    <h4>${product.name}</h4>
                    <h4 class="price">${product.price}</h4>
                    <a href="#" class="btn card-btn">Add to Cart</a>`;


        cardList.appendChild(orderCard)
 //show cart function
        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);

        });
    })
}
const initApp = () => {

    fetch('products.json').then(response => response.json()).then(data => {
            productList = data;
            showCards();
        })
}

initApp();

//add to cart

//addtocart condition



const addToCart = (product) => {
    // Check if already in cart
    const existingProduct = cartProduct.find(item => item.id === product.id);
    if (existingProduct) {
        alert('Item already in your cart!');
        return;
    }

    cartProduct.push(product);

    let quantity = 1; // Moved before it's used
    let price = parseFloat(product.price.replace('$','')) //Total price value

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="item-details detail">
            <h4>${product.name}</h4>
            <h4 class="total-item">${product.price}</h4>
        </div>
        <div class="flex">
            <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>
        </div>
    `;

    cartList.appendChild(cartItem);
    updateTotals();

    const plusBtn = cartItem.querySelector('.plus');
    const minusBtn = cartItem.querySelector('.minus');
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.total-item');

   // + button
plusBtn.addEventListener('click', (e) => {
    e.preventDefault();


    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updateTotals();
});

// - button
minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
          updateTotals();
    }
    else{
        cartItem.classList.add('slide-out')


        setTimeout(()=>{
             cartItem.remove();
      cartProduct = cartProduct.filter(item => item.id !== product.id);

    updateTotals();
        }, 300)
       
   
   
    }
});

}

// --checkout javascript--------
// एलिमेंट्स को सेलेक्ट करना
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const modalTotalAmount = document.getElementById('modalTotalAmount');

// 1. जब कार्ट के अंदर "Check Out" बटन पर क्लिक हो
// (ध्यान दें: आपके HTML में Check Out बटन पर कोई विशिष्ट क्लास या ID नहीं थी, 
// इसलिए हम इसे सेलेक्ट करने के लिए आपकी कार्ट की व्यवस्था का उपयोग कर रहे हैं)
document.querySelector('.cart-tab').addEventListener('click', (e) => {
    if (e.target.textContent === 'Check Out') {
        e.preventDefault();
        
        // कार्ट का करंट टोटल अमाउंट निकालें
        const currentTotal = document.querySelector('.cart-total').textContent;
        
        // अगर कार्ट खाली है ($0.00) तो आगे न बढ़ने दें
        if (currentTotal === '$0.00' || currentTotal === '0') {
            alert('Your cart is empty! Add some delicious food first.');
            return;
        }
        
        // टोटल अमाउंट को पॉप-अप फॉर्म में डालें और फॉर्म खोलें
        modalTotalAmount.textContent = currentTotal;
        checkoutModal.classList.add('active');
    }
});

// 2. फॉर्म का क्लोज (X) बटन काम करने के लिए
closeCheckoutBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

// 3. अगर यूजर फॉर्म के बाहर (डार्क बैकग्राउंड पर) क्लिक करे तो भी बंद हो जाए
window.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
});

// 4. फॉर्म सबमिट (Confirm Order) होने पर
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault(); // पेज रीलोड होने से रोकें
    
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const finalAmount = modalTotalAmount.textContent;

    // यहाँ आप डेटा को बैकएंड सर्वर पर भेज सकते हैं। फिलहाल एक बढ़िया अलर्ट:
    alert(`🎉 Thank you, ${name}!\nYour order of ${finalAmount} has been placed successfully.\nDelivery is on the way to: ${address}`);
    
    // फॉर्म रीसेट करें और मोडल बंद करें
    checkoutForm.reset();
    checkoutModal.classList.remove('active');
    
    // यहाँ आप अपनी कार्ट को खाली (Clear Cart) करने का फंक्शन भी कॉल कर सकते हैं
});

// नए एलिमेंट्स को सेलेक्ट करें
const successPopup = document.getElementById('successPopup');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const randomOrderIdSpan = document.getElementById('randomOrderId');

// फॉर्म सबमिट होने पर (Confirm Order बटन क्लिक करने के बाद का एक्शन)
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault(); // पेज को रीलोड होने से रोकें
    
    // 1. चेकआउट मोडल को बंद करें
    checkoutModal.classList.remove('active');
    
    // 2. एक रैंडम ऑर्डर आईडी जनरेट करें (दिखने में असली लगे इसलिए)
    const randomID = '#FD' + Math.floor(100000 + Math.random() * 900000);
    randomOrderIdSpan.textContent = randomID;
    
    // 3. सक्सेस पॉप-अप को स्क्रीन पर दिखाएं
    successPopup.classList.add('active');
    
    // 4. कार्ट को खाली (Clear) करें
    clearCartData();
});

// "Enjoy Your Meal!" बटन पर क्लिक करने पर सक्सेस पॉप-अप बंद हो जाए
closeSuccessBtn.addEventListener('click', () => {
    successPopup.classList.remove('active');
});

// कार्ट खाली करने का फंक्शन (इसे अपनी कार्ट के लॉजिक के अनुसार एडजस्ट करें)
function clearCartData() {
    // कार्ट लिस्ट का HTML खाली करें
    const cartList = document.querySelector('.cart-list');
    if (cartList) cartList.innerHTML = '';
    
    // कार्ट वैल्यू आइकॉन को 0 करें
    const cartValue = document.querySelector('.cart-value');
    if (cartValue) cartValue.textContent = '0';
    
    // टोटल प्राइस को $0.00 करें
    const cartTotal = document.querySelector('.cart-total');
    if (cartTotal) cartTotal.textContent = '$0.00';
    
    // फॉर्म के सारे इनपुट्स भी क्लियर कर दें
    checkoutForm.reset();
}
// 1. एलिमेंट्स को सेलेक्ट करना
const signinButton = document.querySelector('.desktop-action .btn'); // हेडर का साइन इन बटन
const signinModal = document.getElementById('signinModal');
const closeSigninBtn = document.getElementById('closeSignin');
const signinForm = document.getElementById('signinForm');

// 2. हेडर के "Sign in" बटन पर क्लिक करने पर मोडल खोलें
if (signinButton) {
    signinButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // अगर यूजर पहले से लॉग इन है, तो लॉग आउट का काम करें
        if (localStorage.getItem('isLoggedIn') === 'true') {
            logoutUser();
        } else {
            signinModal.classList.add('active');
        }
    });
}

// 3. क्लोज बटन और आउटसाइड क्लिक इवेंट्स
closeSigninBtn.addEventListener('click', () => {
    signinModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === signinModal) {
        signinModal.classList.remove('active');
    }
});

// 4. बैकएंड ऑथेंटिकेशन सिमुलेशन (Form Submit)
// signinForm का सही और अपडेटेड सबमिट हैंडलर
// signinForm का सही सबमिट हैंडलर
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    try {
        // आपके ब्राउज़र के अनुसार बिल्कुल सटीक यूआरएल (अंडरस्कोर के साथ)
        const response = await fetch('http://localhost/foodie-backend/signin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data.userId);
            
            alert('🎉 ' + data.message);
            updateUIForLoggedInUser();
            signinModal.classList.remove('active');
            signinForm.reset();
        } else {
            // डेटाबेस में ईमेल न मिलने या गलत पासवर्ड होने पर यह मैसेज दिखेगा
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Connection Error:', error);
        alert('❌ Connection Error! Please try again.');
    }
});
// 5. लॉग इन होने पर UI बदलने का फंक्शन
function updateUIForLoggedInUser() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // "Sign in" बटन को "Log Out" में बदलें और आइकॉन चेंज करें
        signinButton.innerHTML = `Log Out &nbsp;<i class="fa-solid fa-right-from-bracket"></i>`;
        signinButton.style.background = 'var(--lead)';
    }
}

// 6. लॉग आउट करने का फंक्शन
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    alert('Logged out successfully.');
    
    // बटन को वापस पुराना जैसा करें
    signinButton.innerHTML = `Sign in &nbsp;<i class="fa-solid fa-right-from-bracket"></i>`;
    signinButton.style.background = 'var(--gold-finger)';
}

// 7. पेज लोड होते ही चेक करें कि क्या यूजर पहले से लॉग इन है
document.addEventListener('DOMContentLoaded', () => {
    updateUIForLoggedInUser();
});

document.getElementById('signinForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Page ko refresh hone se rokne ke liye

    // Input fields se values nikalna
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    // Backend ko bhejne ke liye data object
    const formData = {
        email: email,
        password: password
    };

    // Fetch API ke zariye signin.php ko request bhejna
    fetch('signin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(res => {
        if (res.status === 200 && res.body.status === "success") {
            alert("Login Successful!");
            
            // Modal ko band karein
            document.getElementById('signinModal').style.display = 'none';
            
            // User ko dashboard ya home page par redirect karein
            window.location.href = 'index.html'; 
        } else {
            // Agar koi error aata hai (Jaise wrong password ya email not found)
            alert("Error: " + res.body.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Kuch galat hua! Kripya dobara koshish karein.");
    });
});