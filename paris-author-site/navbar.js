document.addEventListener("DOMContentLoaded", () => {
  const navPlaceholder = document.getElementById("navbar-placeholder");

  if (!navPlaceholder) return;

  navPlaceholder.innerHTML = `
    <nav class="navbar">
      <a href="index.html" class="logo">Paris M. <span>France</span></a>

      <div class="menu-wrap">
        <button class="menu-button">Menu</button>
        <div class="dropdown">
          <a href="login.html" id="login-link">Login</a>
          <a href="signup.html" id="signup-link">Sign Up</a>
          <a href="members.html" id="account-link" style="display:none;">Account</a>
          <a href="#" id="logout-link" style="display:none;">Logout</a>
          <a href="index.html">Home</a>
          <a href="books.html">Books</a>
          <a href="programs.html">Program List</a>
          <a href="notifications.html">Notifications</a>
          <a href="subscriptions.html">My Subscriptions</a>
          <a href="ways-to-pay.html">Ways to Pay</a>
          <a href="preorder.html">Preorder</a>
          <a href="delivery.html">Delivery</a>
          <a href="members.html">Members Home</a>
          <a href="program-library.html">Program Library</a>
          <a href="short-stories.html">Short Stories</a>
          <a href="special-editions.html">Special Editions</a>
          <a href="m-list.html">The M Vault</a>
          <a href="cart.html">Cart (<span id="cart-count">0</span>)</a>
        </div>
      </div>
    </nav>
  `;

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
});
if (window.supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    const loggedIn = !!data.session;

    document.getElementById("login-link").style.display = loggedIn ? "none" : "block";
    document.getElementById("signup-link").style.display = loggedIn ? "none" : "block";
    document.getElementById("account-link").style.display = loggedIn ? "block" : "none";
    document.getElementById("logout-link").style.display = loggedIn ? "block" : "none";
  });

  setTimeout(() => {
    const logout = document.getElementById("logout-link");
    if (logout) {
      logout.addEventListener("click", async (e) => {
        e.preventDefault();
        await supabaseClient.auth.signOut();
        window.location.href = "index.html";
      });
    }
  }, 100);
}