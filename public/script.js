let total = 0;
let cart = {};
let productos = []; // Variable global para almacenar productos

// Función para cargar productos desde productos.json
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });
});

// Función para mostrar los productos
function displayProducts(productos) {
    const container = document.getElementById('items');
    container.innerHTML = ''; // Limpia el contenedor antes de mostrar productos

    productos.forEach(producto => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.setAttribute('data-category', producto.categoria);
        itemDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <span>${producto.nombre} - $${producto.precio}</span>
            <br>
            <button class="quantity-button" onclick="toggleQuantityMenu('${producto.nombre}QtyMenu')">Añadir</button>
            <div class="quantity-menu" id="${producto.nombre}QtyMenu">
                <input type="number" min="1" value="1" id="${producto.nombre}Qty" />
                <button onclick="addToCart('${producto.nombre}', ${producto.precio}, document.getElementById('${producto.nombre}Qty').value)">Agregar al carrito</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}


const categoryItems = document.querySelectorAll('.category-item');

categoryItems.forEach(item => {
    item.addEventListener('click', function() {
        const category = this.textContent.toLowerCase();
        filterProductsByCategory(category);
    });
});



function filterProductsByCategory(category) {
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'todos' || itemCategory === category) {
            item.style.display = 'block'; // Mostrar el item
        } else {
            item.style.display = 'none'; // Ocultar el item
        }
    });
}



function addToCart(item, price, quantity) {
    quantity = parseInt(quantity);
    if (1 + 1 == 2) {
        if (cart[item]) {
            cart[item].quantity += quantity;
        } else {
            cart[item] = { price, quantity };
        }
        updateCart();
        showModal(`${quantity} ${item}(s) añadidos al carrito`);
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Desplazamiento suave
        });
            // Agregar la clase de animación al ícono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('animate');

    // Quitar la clase de animación después de un breve periodo
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 1100); // Tiempo que dura la animación (300 ms)
    } else {
        alert(`No hay suficiente stock de ${item}. Disponible: ${stock[item]}`);
    }
}


function updateCart() {
    const cartSummary = document.getElementById('cartSummary');
    cartSummary.innerHTML = ''; // Limpiar el resumen actual

    let subtotal = 0;
    let itemCount = 0;
    
    for (const [item, details] of Object.entries(cart)) {
        const itemTotal = details.price * details.quantity;
        subtotal += itemTotal;
        itemCount += details.quantity;
        
        cartSummary.innerHTML += `
            <div class="cart-item">
                <span>${item} (x${details.quantity})</span>
                <span>$${itemTotal}</span>
            </div>
        `;
    }

    document.getElementById('total').textContent = subtotal;
    document.getElementById('cartItemCount').textContent = itemCount;
}

function toggleCart() {
    const cartMenu = document.getElementById('cartMenu');
    cartMenu.style.display = cartMenu.style.display === 'block' ? 'none' : 'block';
}

function showCheckoutForm() {
    document.getElementById('checkoutForm').style.display = 'block';
}

function confirmPurchase() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const orderDetails = `Día: ${new Date().toLocaleDateString()}, Nombre: ${name}, Teléfono: ${phone}, Items del pedido: ${JSON.stringify(cart)}, Total: $${document.getElementById('total').textContent}`;
    
    // Aquí puedes implementar el envío del pedido a tu número de teléfono
    console.log(orderDetails); // Solo para propósitos de depuración

    // Resetear el carrito
    total = 0;
    cart = {};
    document.getElementById('total').textContent = total;
    document.getElementById('cartSummary').innerHTML = ''; // Limpiar el resumen del carrito
    document.getElementById('cartItemCount').textContent = '0';
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
}

function scrollToCheckout() {
    window.scrollTo({
        top: document.body.scrollHeight, // Desplazarse hasta el final del documento
        behavior: 'smooth' // Desplazamiento suave
    });
}

function toggleQuantityMenu(menuId) {
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}



async function sendToDiscord(orderDetails) {
    const webhookURL = 'https://discord.com/api/webhooks/1421200662666018851/5Ouj_xj0D6tFDhu11y1Zq4zSG9eJe5hNpoilkz5wlrjmc8pjrIrpkfMV6jqs4o_1oA9k';

    const message = {
        embeds: [{
            title: "Nuevo Pedido",
            color: 7506394,
            fields: [
                { name: "Día", value: new Date().toLocaleDateString(), inline: true },
                { name: "Nombre", value: orderDetails.name, inline: true },
                { name: "Teléfono", value: orderDetails.phone, inline: true },
                { name: "Dirección", value: orderDetails.address, inline: false },
                { name: "Items del pedido", value: orderDetails.items.join("\n"), inline: false },
                { name: "Total", value: `$${orderDetails.total}`, inline: true }
            ],
            timestamp: new Date(),
            footer: {
                text: "Gracias por tu compra!"
            }
        }]
    };

    const response = await fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    if (response.ok) {
        console.log('Mensaje enviado a Discord!');
    } else {
        console.error('Error al enviar el mensaje a Discord:', response.statusText);
    }
}



function confirmPurchase() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Verificar si todos los campos están llenos
    if (!name || !phone || !address) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Verificar si hay productos en el carrito
    if (Object.keys(cart).length === 0) {
        alert("Debes agregar al menos un producto al carrito.");
        return;
    }

    const items = Object.keys(cart).map(item => `${item} (x${cart[item].quantity})`);
    const total = document.getElementById('total').textContent;

    const orderDetails = {
        name: name,
        phone: phone,
        address: address,
        items: items,
        total: total
    };

    // Enviar el mensaje a Discord
    sendToDiscord(orderDetails);

    // Mostrar el mensaje de agradecimiento
    showThankYouMessage();

    // Resetear el carrito
    resetCart();

    // Recargar la página
    setTimeout(() => {
        location.reload();
    }, 5000); // 5 segundos para que el usuario vea el mensaje
}


function resetCart() {
    // Resetear el carrito y los valores
    total = 0;
    cart = {};
    document.getElementById('total').textContent = total;
    document.getElementById('cartSummary').innerHTML = '';
    document.getElementById('cartItemCount').textContent = '0';
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
}



function toggleCart() {
    const cartMenu = document.getElementById('cartMenu');
    cartMenu.style.display = cartMenu.style.display === 'block' ? 'none' : 'block';
    
    if (cartMenu.style.display === 'block') {
        scrollToCart();
    }
}

function scrollToCart() {
    const cartMenu = document.getElementById('cartMenu');
    cartMenu.scrollIntoView({ behavior: 'smooth', block: 'start' });
}



function showThankYouMessage() {
    // Crear un contenedor para el mensaje
    const messageContainer = document.createElement('div');
    messageContainer.className = 'thank-you-message';
    messageContainer.innerText = "Gracias por su pedido, en breve le llegará un mensaje de confirmación";
    
    document.body.appendChild(messageContainer);
    
    // Estilo para el mensaje
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '20%';
    messageContainer.style.right = '20px'; // Ubicar a la derecha
    messageContainer.style.padding = '20px';
    messageContainer.style.backgroundColor = '#ffffff';
    messageContainer.style.border = '2px solid #4CAF50';
    messageContainer.style.borderRadius = '10px';
    messageContainer.style.zIndex = '1000';
    messageContainer.style.textAlign = 'center';
    
    // Disparar confeti
    confetti();
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
        document.body.removeChild(messageContainer);
    }, 6000); // Cambia el tiempo a 5000 ms (5 segundos)
}


function filterProducts() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemName = item.textContent.toLowerCase();
        if (itemName.includes(query)) {
            item.style.display = 'block'; // Mostrar el item
        } else {
            item.style.display = 'none'; // Ocultar el item
        }
    });
}

function showModal(message) {
    document.getElementById("modalMessage").innerText = message;
    document.getElementById("modal").style.display = "flex"; // Muestra el modal
    
    // Cierra el modal automáticamente después de 2 segundos
    setTimeout(closeModal, 2000); 
}

function closeModal() {
    document.getElementById("modal").style.display = "none"; // Oculta el modal
}


// Cierra el modal si el usuario hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
}

const text = "Resaka MDP";
let element = document.getElementById("animatedText");
let isDeleting = false;
let charIndex = 0;

function typeEffect() {
  element.textContent = text.slice(0, charIndex);

  if (!isDeleting && charIndex === text.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1500); // Pausa antes de borrar
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    setTimeout(typeEffect, 300); // Pausa antes de volver a escribir
  } else {
    charIndex += isDeleting ? -1 : 1;
    setTimeout(typeEffect, isDeleting ? 250 : 400);
  }
}

typeEffect();
