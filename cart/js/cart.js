
const cartContainer = document.getElementById("cart-container");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedPromo = null; 


cart = cart.map(item => {
  if (!item.quantity) {
    item.quantity = 1;
  }
  return item;
});

async function renderCart() {
  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="wishlist-empty text-center">
         <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" class="w-25" alt="Empty Cart">
         <h2>Oops! Your cart is empty</h2>
         <p class="text-muted">Start adding items you love and save them for later.</p>
        <a href="/products/index.html" class="btn mt-3 px-4 py-2 mb-4">
          <i class="bi bi-shop me-2"></i> Continue Shopping
        </a>
    </div>`;
    subtotalEl.innerText = "$0.00";
    discountEl.innerText = "-$0.00";
    totalEl.innerText = "$0.00";
    return;
  }

  cartContainer.innerHTML = "";
  let subtotal = 0;

  for (let item of cart) {
    subtotal += item.price * item.quantity;

   const productHTML = `
  <div class="row align-items-center mb-3">
    
    <div class="col-3 col-md-2">
      <img src="${item.thumbnail}" class="img-fluid rounded product-img" alt="">
    </div>

    
    <div class="col-9 col-md-10 pt-4 ps-5">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="fw-bold mb-1">${item.title}</h5>
        <i class="fas fa-trash trash-icon" onclick="removeFromCart(${item.id})"></i>
      </div>
      <span>Category : ${item.category}</span>
      <p class="fw-bold mb-2" id="price-${item.id}">$${(item.price * item.quantity).toFixed(2)}</p>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
        <span class="px-2" id="quantity-${item.id}">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
      </div>
    </div>
    <hr class="mt-3">
  </div>
`;


    cartContainer.innerHTML += productHTML;
  }

  updateTotals();
}


function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}


function updateProductQuantityView(id) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  const quantitySpan = document.getElementById(`quantity-${id}`);
  if (quantitySpan) quantitySpan.innerText = item.quantity;

  const priceEl = document.getElementById(`price-${id}`);
  if (priceEl) priceEl.innerText = `$${(item.price * item.quantity).toFixed(2)}`;
}

// زيادة الكمية
function increaseQuantity(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateProductQuantityView(id);
    updateTotals();
  }
}


function decreaseQuantity(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1 && cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateProductQuantityView(id);
    updateTotals();
  } else if (cart[index] && cart[index].quantity === 1) {
    removeFromCart(id);
  }
}


function updateTotals() {
  let subtotal = 0;

  for (let item of cart) {
    subtotal += item.price * item.quantity;
  }

  const discountFromCart = subtotal * 0.2;
  const discountFromPromo = appliedPromo ? subtotal * appliedPromo : 0;
  const totalDiscount = discountFromCart + discountFromPromo;

  const delivery = 15;
  const total = subtotal - totalDiscount + delivery;

  subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  discountEl.innerText = `-$${totalDiscount.toFixed(2)}`;
  totalEl.innerText = `$${total.toFixed(2)}`;
}

function applyPromoCode() {
  const input = document.getElementById("promo-input");
  const code = input.value.trim().toLowerCase();
  const messageEl = document.getElementById("promo-message");

  if (code === "shahd10") {
    appliedPromo = 0.1;
    messageEl.innerText = "Promo code applied successfully! 10% off.";
    messageEl.classList.remove("text-danger");
    messageEl.classList.add("text-success");
  } else {
    appliedPromo = null;
    messageEl.innerText = "Invalid promo code.";
    messageEl.classList.remove("text-success");
    messageEl.classList.add("text-danger");
  }

  updateTotals();
}

renderCart();
