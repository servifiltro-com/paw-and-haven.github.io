const products=[
['bed','Beds & Comfort','Orthopedic Pet Bed',49.99,'assets/prod_bed.jpg?v=7','Supportive everyday bed with a soft, cozy finish.'],
['toy','Toys','Plush Elephant Toy',14.99,'assets/prod_elephant.jpg?v=7','Soft enrichment toy for gentle play sessions.'],
['walk','Walking & Outdoor','Premium Leather Collar',24.99,'assets/prod_collar.jpg?v=7','Classic leather collar with a polished finish.'],
['feed','Feeding','Stainless Steel Bowl',19.99,'assets/prod_bowl.jpg?v=7','Easy-clean bowl for daily meals and water.'],
['groom','Grooming','Deshedding Brush',24.99,'assets/prod_brush.jpg?v=7','Comfortable grooming brush for regular coat care.'],
['travel','Travel','Pet Carrier',59.99,'assets/prod_carrier.jpg?v=7','Secure travel carrier for everyday trips.'],
['toy','Toys','Rope Chew Toy',12.99,'assets/prod_rope.jpg?v=7','Textured rope toy made for active play.'],
['walk','Walking & Outdoor','No-Pull Harness',34.99,'assets/prod_harness.jpg?v=7','Comfort-focused harness for daily walks.'],
['bed','Beds & Comfort','Calming Lounge Bed',64.99,'assets/prod_bed.jpg?v=7','Deep comfort for naps and quiet time.'],
['toy','Toys','Soft Companion Elephant',16.99,'assets/prod_elephant.jpg?v=7','Cuddly companion for relaxed play.'],
['walk','Walking & Outdoor','Classic Everyday Collar',21.99,'assets/prod_collar.jpg?v=7','Simple, durable collar for daily adventures.'],
['feed','Feeding','Everyday Pet Bowl',17.99,'assets/prod_bowl.jpg?v=7','Clean-lined feeding bowl for home use.'],
['groom','Grooming','Daily Coat Brush',22.99,'assets/prod_brush.jpg?v=7','Gentle brush for keeping coats tidy.'],
['travel','Travel','Compact Travel Carrier',54.99,'assets/prod_carrier.jpg?v=7','Practical carrier for short trips.'],
['toy','Toys','Heavy-Duty Rope Toy',15.99,'assets/prod_rope.jpg?v=7','Durable rope for interactive games.'],
['walk','Walking & Outdoor','Adventure Harness',39.99,'assets/prod_harness.jpg?v=7','Supportive harness for outdoor exploration.']
];
let cart=JSON.parse(localStorage.getItem('pawCart')||'[]'), wishes=JSON.parse(localStorage.getItem('pawWish')||'[]'), active='All';
const $=s=>document.querySelector(s); const grid=$('#productGrid');
function money(n){return '$'+n.toFixed(2)}
function render(){let list=products.filter(p=>active==='All'||p[1]===active);let q=($('#search')?.value||$('#msearch')?.value||'').toLowerCase(); if(q)list=list.filter(p=>(p[2]+p[1]+p[5]).toLowerCase().includes(q)); let sort=$('#sort').value;if(sort==='low')list.sort((a,b)=>a[3]-b[3]);if(sort==='high')list.sort((a,b)=>b[3]-a[3]);if(sort==='name')list.sort((a,b)=>a[2].localeCompare(b[2]));grid.innerHTML=list.map((p,i)=>`<article class="card"><button class="heart ${wishes.includes(p[2])?'saved':''}" onclick="toggleWish('${p[2]}')">♡</button><div class="cardImg"><img src="${p[4]}" alt="${p[2]}"></div><div class="cardBody"><small class="cardCat">${p[1]}</small><h3>${p[2]}</h3><p>${p[5]}</p><div class="cardFoot"><b class="price">${money(p[3])}</b><button class="add" onclick="add(${products.indexOf(p)})">Add to cart</button></div></div></article>`).join('')}
function save(){localStorage.setItem('pawCart',JSON.stringify(cart));localStorage.setItem('pawWish',JSON.stringify(wishes));updateCounts()}
function updateCounts(){let n=cart.reduce((s,x)=>s+x.qty,0);$('#cartCount').textContent=n;$('#mcount').textContent=n;$('#wishCount').textContent=wishes.length;$('#cartTotal').textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));renderCart()}
function add(i){let p=products[i],x=cart.find(a=>a.name===p[2]);x?x.qty++:cart.push({name:p[2],price:p[3],img:p[4],qty:1});save();openCart()}
function toggleWish(name){let i=wishes.indexOf(name);i>=0?wishes.splice(i,1):wishes.push(name);save()}
function renderCart(){$('#cartItems').innerHTML=cart.length?cart.map((x,i)=>`<div class="cartItem"><img src="${x.img}"><div><b>${x.name}</b><div>${money(x.price)}</div><button onclick="qty(${i},-1)">−</button> ${x.qty} <button onclick="qty(${i},1)">+</button></div><button onclick="removeItem(${i})">×</button></div>`).join(''):'<p>Your cart is empty.</p>'}
function qty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save()}function removeItem(i){cart.splice(i,1);save()}
function openCart(){$('#drawer').classList.add('open');$('#backdrop').classList.add('show')}function closeAll(){$('#drawer').classList.remove('open');$('#backdrop').classList.remove('show');$('#modal').classList.remove('show')}
$('#cartBtn').onclick=openCart;$('#mcart').onclick=openCart;$('#closeCart').onclick=closeAll;$('#backdrop').onclick=closeAll;$('#modalClose').onclick=closeAll;$('#sort').onchange=render;$('#search').oninput=render;$('#msearch').oninput=render;
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{active=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});document.querySelectorAll('.cat').forEach(a=>a.onclick=()=>{active=a.dataset.filter;document.querySelectorAll('.filter').forEach(x=>{x.classList.toggle('active',x.dataset.filter===active)});setTimeout(render,50)});
$('#supportForm').onsubmit=e=>{e.preventDefault();$('#formMsg').textContent='Thanks! Your message has been received.';e.target.reset()};$('#news').onsubmit=e=>{e.preventDefault();alert('Thanks for joining PAW & HAVEN!');e.target.reset()};$('#checkout').onclick=()=>alert('Demo checkout — connect your payment provider here.');
window.add=add;window.toggleWish=toggleWish;window.qty=qty;window.removeItem=removeItem;
render();updateCounts();
