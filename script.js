/* ---------- HELPERS ---------- */
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = users => localStorage.setItem("users", JSON.stringify(users));

const loginUser = email => {
  localStorage.setItem("user", JSON.stringify({ email }));
  location.href = "products.html";
};

/* ---------- AUTH ---------- */
function signup() {
  const email = signupEmail.value;
  const password = signupPassword.value;

  if (!email || password.length < 6) return alert("Invalid input");

  const users = getUsers();
  if (users.some(u => u.email === email)) return alert("User exists");

  users.push({ email, password: btoa(password) });
  saveUsers(users);
  loginUser(email);
}

function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const user = getUsers().find(
    u => u.email === email && u.password === btoa(password)
  );

  if (!user) return alert("Invalid credentials");
  loginUser(email);
}

function forgotPassword() {
  const email = forgotEmail.value;
  if (!email) return alert("Enter email");

  const token = crypto.randomUUID();
  localStorage.setItem("resetToken", JSON.stringify({
    email,
    token,
    expires: Date.now() + 15 * 60 * 1000
  }));

  location.href = `reset.html?token=${token}`;
}

function resetPassword() {
  const token = new URLSearchParams(location.search).get("token");
  const data = JSON.parse(localStorage.getItem("resetToken"));

  if (!data || data.token !== token || Date.now() > data.expires) {
    alert("Invalid or expired token");
    location.href = "login.html";
    return;
  }

  if (password.value !== confirm.value || password.value.length < 6)
    return alert("Password error");

  const users = getUsers();
  const i = users.findIndex(u => u.email === data.email);
  users[i].password = btoa(password.value);
  saveUsers(users);

  localStorage.removeItem("resetToken");
  alert("Password reset successful");
  location.href = "login.html";
}

function logout() {
  localStorage.removeItem("user");
  location.href = "login.html";
}

function protectPage() {
  if (!localStorage.getItem("user")) location.href = "login.html";
}

/* ---------- PRODUCTS ---------- */
let allProducts = [];

async function loadProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  allProducts = await res.json();
  renderProducts(allProducts);
}

function renderProducts(list) {
  products.innerHTML = "";
  list.forEach(p => {
    products.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h4>${p.title}</h4>
        <p>R ${Math.round(p.price * 18)}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
      </div>`;
  });
}

/* ---------- CART ---------- */
function addToCart(p) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(p);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartDiv.innerHTML = cart.length
    ? cart.map((i, idx) =>
        `<p>${i.title} <button onclick="removeFromCart(${idx})">Remove</button></p>`
      ).join("")
    : "<p>Cart empty</p>";
}

function removeFromCart(i) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

/* ---------- PROFILE ---------- */
function loadProfile() {
  profileEmail.innerText = JSON.parse(localStorage.getItem("user")).email;
}
