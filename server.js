const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // npm install node-fetch@2

const app = express();
const PORT = 5500;

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Middleware para parsear JSON y form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para obtener productos
app.get('/api/productos', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'productos.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer productos.json:', err);
            return res.status(500).send('Error interno del servidor');
        }
        try {
            const productos = JSON.parse(data);
            res.json(productos);
        } catch (parseErr) {
            console.error('Error al parsear productos.json:', parseErr);
            res.status(500).send('Error interno del servidor');
        }
    });
});

// Endpoint para enviar pedido a Discord
app.post('/sendDiscord', async (req, res) => {
    const { name, phone, address, items, total } = req.body;
    if (!name || !phone || !address || !items || !total) {
        return res.status(400).json({ ok: false, error: 'Faltan datos del pedido' });
    }

    const webhookURL = 'TU_WEBHOOK_AQUI';
    const message = {
        embeds: [{
            title: "Nuevo Pedido",
            color: 7506394,
            fields: [
                { name: "Nombre", value: name, inline: true },
                { name: "Teléfono", value: phone, inline: true },
                { name: "Dirección", value: address, inline: false },
                { name: "Items del pedido", value: items.join("\n"), inline: false },
                { name: "Total", value: `$${total}`, inline: true }
            ],
            timestamp: new Date()
        }]
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
        if (!response.ok) throw new Error(response.statusText);
        res.json({ ok: true });
    } catch (err) {
        console.error('Error enviando a Discord:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
