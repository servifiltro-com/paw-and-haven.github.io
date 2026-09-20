const products = [{"id": 1, "name": "Orthopedic Cloud Bed", "cat": "Beds", "price": 49.99, "img": "orthopedic-bed.jpg", "desc": "Deep-cushion comfort for relaxed naps and everyday rest.", "rating": 5}, {"id": 2, "name": "Classic Treat Toy", "cat": "Toys", "price": 12.99, "img": "toy.jpg", "desc": "A durable interactive toy for play and enrichment.", "rating": 5}, {"id": 3, "name": "No-Pull Comfort Harness", "cat": "Walking", "price": 29.99, "img": "harness.jpg", "desc": "A comfortable everyday harness designed for confident walks.", "rating": 5}, {"id": 4, "name": "Stainless Steel Pet Bowl", "cat": "Feeding", "price": 19.99, "img": "bowl.jpg", "desc": "Easy-care feeding bowl with a timeless stainless finish.", "rating": 4}, {"id": 5, "name": "Self-Cleaning Grooming Brush", "cat": "Grooming", "price": 24.99, "img": "grooming.jpg", "desc": "A practical brush for regular coat care and shedding control.", "rating": 5}, {"id": 6, "name": "Soft-Side Travel Carrier", "cat": "Travel", "price": 59.99, "img": "carrier.jpg", "desc": "Comfortable travel storage for road trips and everyday journeys.", "rating": 5}, {"id": 7, "name": "Outdoor Fetch Set", "cat": "Outdoor", "price": 22.99, "img": "outdoor.jpg", "desc": "Play-ready outdoor essentials for active afternoons.", "rating": 4}, {"id": 8, "name": "Cozy Winter Jacket", "cat": "Apparel", "price": 29.99, "img": "apparel.jpg", "desc": "Warm, lightweight protection for cooler walks.", "rating": 5}, {"id": 9, "name": "Leather Everyday Collar", "cat": "Walking", "price": 18.99, "img": "collar.jpg", "desc": "Adjustable everyday collar with a classic premium look.", "rating": 5}, {"id": 10, "name": "Cooling Comfort Bed", "cat": "Beds", "price": 44.99, "img": "bed.jpg", "desc": "A soft resting space designed for calm afternoons.", "rating": 4}, {"id": 11, "name": "Travel Feeding Kit", "cat": "Travel", "price": 27.99, "img": "bowl.jpg", "desc": "Portable feeding essentials for weekends away.", "rating": 5}, {"id": 12, "name": "Gentle Grooming Set", "cat": "Grooming", "price": 31.99, "img": "grooming.jpg", "desc": "A compact grooming collection for regular home care.", "rating": 5}, {"id": 13, "name": "Adventure Harness", "cat": "Outdoor", "price": 34.99, "img": "harness.jpg", "desc": "Secure, comfortable gear for new adventures.", "rating": 4}, {"id": 14, "name": "Interactive Plush Friend", "cat": "Toys", "price": 14.99, "img": "toy.jpg", "desc": "Soft playtime companion for gentle indoor fun.", "rating": 5}, {"id": 15, "name": "Ceramic-Style Feeder", "cat": "Feeding", "price": 21.99, "img": "bowl.jpg", "desc": "A clean, home-friendly feeding option for daily meals.", "rating": 4}, {"id": 16, "name": "Classic Pet ID Tag", "cat": "Walking", "price": 14.99, "img": "tag.jpg", "desc": "A simple personalized-style accessory for everyday wear.", "rating": 5}];
let activeFilter = "All";
let cart = JSON.parse(localStorage.getItem("pawCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("pawWish") || "[]");

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function money(v) { return `$${v.toFixed(2)}`; }
function save() {
  localStorage.setItem("pawCart", JSON.stringify(cart));
  localStorage.setItem("pawWish", JSON.stringify(wishlist));
  $("#cartCount").textContent = cart.reduce((n,i)=>n+i.qty,0);
  $("#wishCount").textContent = wishlist.length;
}
function stars(n) { return "★".repeat(n) + "☆".repeat(5-n); }

function renderProducts() {
  const q = ($("#searchInput")?.value || "").toLowerCase().trim();
  const sort = $("#sortSelect")?.value || "featured";
  let list = products.filter(p => (activeFilter==="All" || p.cat===activeFilter) && (!q || (p.name+" "+p.cat+" "+p.desc).toLowerCase().includes(q)));
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="az") list.sort((a,b)=>a.name.localeCompare(b.name));
  $("#products").innerHTML = list.map(p => `
    <article class="product-card">
      <button class="heart ${wishlist.includes(p.id)?'saved':''}" onclick="toggleWish(${p.id})" aria-label="Favorite">♥</button>
      <button class="product-image" onclick="openProduct(${p.id})"><img src="assets/images/${p.img}" alt="${p.name}"></button>
      <div class="product-info"><span class="product-cat">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="rating">${stars(p.rating)} <small>(${Math.floor(60+p.id*7)})</small></div><div class="price-row"><strong>${money(p.price)}</strong><button class="add" onclick="addCart(${p.id})">Add to cart</button></div></div>
    </article>`).join("") || `<div class="empty">No products match your search.</div>`;
}
function toggleWish(id) {
  wishlist = wishlist.includes(id) ? wishlist.filter(x=>x!==id) : [...wishlist,id];
  save(); renderProducts();
}
function addCart(id) {
  const item=cart.find(x=>x.id===id); if(item) item.qty++; else cart.push({id,qty:1});
  save(); renderCart(); openDrawer();
}
function renderCart() {
  const box=$("#cartItems");
  if(!cart.length) { box.innerHTML='<div class="empty">Your cart is empty.<br><a href="#shop" onclick="closeDrawer()">Start shopping →</a></div>'; $("#cartTotal").textContent="$0.00"; return; }
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); total+=p.price*item.qty;
    return `<div class="cart-item"><img src="assets/images/${p.img}" alt=""><div><b>${p.name}</b><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeCart(${p.id})">×</button></div>`;
  }).join("");
  $("#cartTotal").textContent=money(total);
}
function changeQty(id,d) { const x=cart.find(i=>i.id===id); if(!x)return; x.qty+=d; if(x.qty<=0) cart=cart.filter(i=>i.id!==id); save(); renderCart(); }
function removeCart(id) { cart=cart.filter(i=>i.id!==id); save(); renderCart(); }
function openDrawer() { $("#drawer").classList.add("open"); $("#overlay").classList.add("show"); }
function closeDrawer() { $("#drawer").classList.remove("open"); $("#overlay").classList.remove("show"); }
function openProduct(id) {
  const p=products.find(x=>x.id===id);
  $("#modalContent").innerHTML=`<div class="modal-product"><img src="assets/images/${p.img}" alt="${p.name}"><div><span class="product-cat">${p.cat}</span><h2>${p.name}</h2><div class="rating">${stars(p.rating)}</div><p>${p.desc}</p><strong class="modal-price">${money(p.price)}</strong><button class="btn primary" onclick="addCart(${p.id});closeModal()">Add to cart</button></div></div>`;
  $("#productModal").classList.add("show"); $("#overlay").classList.add("show");
}
function closeModal() { $$(".modal").forEach(m=>m.classList.remove("show")); $("#overlay").classList.remove("show"); }
function setFilter(f) {
  activeFilter=f;
  $$(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===f));
  renderProducts(); document.querySelector("#shop").scrollIntoView({behavior:"smooth"});
}
$$(".filter, .cat, .promo button").forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.filter)));
$("#searchInput").addEventListener("input",renderProducts);
$("#sortSelect").addEventListener("change",renderProducts);
$("#cartBtn").onclick=openDrawer;
$("#closeDrawer").onclick=closeDrawer;
$("#overlay").onclick=()=>{closeDrawer();closeModal();};
$("#supportChat").onclick=()=>{$("#supportModal").classList.add("show");$("#overlay").classList.add("show");};
$$("[data-close]").forEach(b=>b.onclick=closeModal);
$("#searchBtn").onclick=()=>{$("#searchInput").focus();document.querySelector("#shop").scrollIntoView({behavior:"smooth"});};
$("#wishlistBtn").onclick=()=>{renderProducts();document.querySelector("#shop").scrollIntoView({behavior:"smooth"});};
$("#checkoutBtn").onclick=()=>alert("Demo checkout: your cart is ready. Connect a payment provider for production.");
$("#newsletter").addEventListener("submit",e=>{e.preventDefault(); alert("Thanks for joining the PAW & HAVEN community!"); e.target.reset();});
save(); renderCart(); renderProducts();
