document.addEventListener("DOMContentLoaded", () => {
  const navPlaceholder = document.getElementById("navbar-placeholder");

  if (!navPlaceholder) return;

  navPlaceholder.innerHTML = `
    <nav class="navbar">
      <a href="index.html" class="logo">Paris M. <span>France</span></a>

      <div class="menu-wrap">
        <button class="menu-button">Menu</button>
        <div class="dropdown">
          <a href="index.html">Home</a>
          <a href="books.html">Books</a>
          <a href="programs.html">Program List</a>
          <a href="notifications.html">Notifications</a>
          <a href="subscriptions.html">My Subscriptions</a>
          <a href="ways-to-pay.html">Ways to Pay</a>
          <a href="preorder.html">Preorder</a>
          <a href="delivery.html">Delivery</a>
          <a href="cart.html">Cart (<span id="cart-count">0</span>)</a>
        </div>
      </div>
    </nav>
  `;

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
});