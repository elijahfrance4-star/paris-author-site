document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("dropdown");
  const btn = document.querySelector(".menu-btn");

  btn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
    console.log("dropdown clicked");
  });
});
let cart = [];

function addToCart(item) {
  cart.push(item);
  updateCart();
}

function updateCart() {
  document.getElementById("cartCount").innerText = cart.length;

  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    cartItems.innerHTML += `
      <p>${item}</p>
    `;
  });
}

function openCart() {
  document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}
