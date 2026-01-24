const $ = id => document.getElementById(id);

/* ======================
   USER SESSION
====================== */

function startShopping() {
  const name = $("name").value.trim();
  const email = $("email").value.trim();

  if (name.length < 3) {
    alert("Name must be at least 3 characters");
    return;
  }

  if (!email.includes("@")) {
    alert("Enter a valid email");
    return;
  }

  localStorage.setItem(
    "currentUser",
    JSON.stringify({ name, email })
  );

  location.href = "products.html";
}

function protectPage() {
  if (!localStorage.getItem("currentUser")) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
}

function loadUser() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    $("userGreeting").innerText = `Hi, ${user.name}`;
  }
}

/* ======================
   PRODUCTS
====================== */

let allProducts = [];

async function loadProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  allProducts = await res.json();
  renderProducts(allProducts);
}

function renderProducts(list) {
  $("products").innerHTML = list.map((p, i) => `
    <div class="product">
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <p>R ${Math.round(p.price * 18)}</p>
      <button onclick="addToCart(${i})">Add to Cart</button>
    </div>
  `).join("");
}

function searchProducts() {
  const term = $("searchInput").value.toLowerCase();
  renderProducts(
    allProducts.filter(p =>
      p.title.toLowerCase().includes(term)
    )
  );
}

function filterCategorySelect() {
  const cat = $("categorySelect").value;
  renderProducts(
    cat === "all"
      ? allProducts
      : allProducts.filter(p => p.category === cat)
  );
}

/* ======================
   CART
====================== */

function addToCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(allProducts[index]);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const div = $("cart");

  if (!cart.length) {
    div.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  let total = 0;

  div.innerHTML = cart.map((item, i) => {
    const price = Math.round(item.price * 18);
    total += price;

    return `
      <div class="cart-item">
        <img src="${item.image}">
        <h4>${item.title}</h4>
        <p>R ${price}</p>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
  }).join("") + `
    <h3>Total: R ${total}</h3>
    <button onclick="clearCart()">Clear Cart</button>
  `;
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  loadCart();
}

/* ======================
   PROFILE (EMAIL-BASED)
====================== */

function loadProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const profile = JSON.parse(
    localStorage.getItem(`profile_${user.email}`)
  ) || {};

  $("profileEmail").value = user.email;
  $("profileName").value = profile.name || user.name;
  $("profilePhone").value = profile.phone || "";
  $("profileAddress").value = profile.address || "";
}

function saveProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  localStorage.setItem(
    `profile_${user.email}`,
    JSON.stringify({
      name: $("profileName").value,
      phone: $("profilePhone").value,
      address: $("profileAddress").value
    })
  );

  alert("Profile saved ✅");
}
