function addToCart(bookId, title, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.bookId === bookId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      bookId,
      title,
      price,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showCartToast(title);
}

function showCartToast(title) {
  const toast = document.getElementById("cart-toast");
  const toastText = document.getElementById("cart-toast-text");

  if (!toast || !toastText) return;

  toastText.textContent = `${title} was added successfully.`;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBox = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");

  if (!cartBox || !totalBox) return;

  if (cart.length === 0) {
    cartBox.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add a book to get started.</p>
      </div>
    `;
    totalBox.innerHTML = "$0.00";
    return;
  }

  let total = 0;

  cartBox.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="cart-item">
        <div>
          <h3>${item.title}</h3>
          <p>Quantity: ${item.quantity}</p>
          <p>$${itemTotal.toFixed(2)}</p>
        </div>

        <button class="remove-btn" onclick="removeFromCart('${item.bookId}')">
          Remove
        </button>
      </div>
    `;
  }).join("");

  totalBox.innerHTML = "$" + total.toFixed(2);
}

function removeFromCart(bookId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.bookId !== bookId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

async function checkoutCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const response = await fetch("/.netlify/functions/create-checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cart })
  });

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Checkout error: " + data.error);
  }
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = count;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartCount();
});