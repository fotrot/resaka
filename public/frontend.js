document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

function cargarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(productos => {
            const itemsContainer = document.getElementById("items");
            itemsContainer.innerHTML = ''; // Limpiar el contenedor

            productos.forEach(producto => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("item");
                itemDiv.setAttribute("data-category", producto.categoria);

                itemDiv.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <span>${producto.nombre} $${producto.precio}</span>
                    <button class="quantity-button" onclick="toggleQuantityMenu('qtyMenu_${producto.nombre}')">Añadir</button>
                    <div class="quantity-menu" id="qtyMenu_${producto.nombre}">
                        <input type="number" min="1" value="1" />
                        <button onclick="addToCart('${producto.nombre}', ${producto.precio}, this.previousElementSibling.value)">Agregar al carrito</button>
                    </div>
                `;

                itemsContainer.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });
}
