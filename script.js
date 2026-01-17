
const $ = id => document.getElementById(id);

const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = users => localStorage.setItem("users", JSON.stringify(users));

const loginUser = email => {
  localStorage.setItem("user", JSON.stringify({ email }));
  location.href = "products.html";
};


function signup() {
  const email = $("signupEmail").value;
  const password = $("signupPassword").value;

  if (!email || password.length < 6) return alert("Invalid input");

  const users = getUsers();
  if (users.some(u => u.email === email)) return alert("User exists");

  users.push({ email, password: btoa(password) });
  saveUsers(users);
  loginUser(email);
}

function login() {
  const email = $("loginEmail").value;
  const password = $("loginPassword").value;

  const user = getUsers().find(
    u => u.email === email && u.password === btoa(password)
  );

  if (!user) return alert("Invalid credentials");
  loginUser(email);
}

function logout() {
  localStorage.removeItem("user");
  location.href = "login.html";
}

function protectPage() {
  if (!localStorage.getItem("user")) location.href = "login.html";
}


let allProducts = [];

async function loadProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  allProducts = await res.json();
  renderProducts(allProducts);
}

function renderProducts(list) {
  $("products").innerHTML = list.length
    ? list.map((p, index) => `
      <div class="product">
        <img src="${p.image}">
        <h4>${p.title}</h4>
        <p>R ${Math.round(p.price * 18)}</p>
        <button onclick="addToCartByIndex(${index})">
          Add to Cart
        </button>
      </div>
    `).join("")
    : "<p>No products found</p>";
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

/* ---------- CART ---------- */
function addToCartByIndex(index) {
  const product = allProducts[index];
  addToCart(product);
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartDiv = $("cart");

  if (!cart.length) {
    cartDiv.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  let total = 0;

  cartDiv.innerHTML = cart.map((item, index) => {
    const price = Math.round(item.price * 18);
    total += price;

    return `
      <div class="cart-item">
        <img src="${item.image}">
        <div class="cart-info">
          <h4>${item.title}</h4>
          <p>R ${price}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  }).join("") + `
    <div class="cart-total">
      <h3>Total: R ${total}</h3>
      <button onclick="clearCart()">Clear Cart</button>
    </div>
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


function loadProfile() {
  $("profileEmail").innerText =
    JSON.parse(localStorage.getItem("user")).email;
}
