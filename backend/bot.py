import tkinter as tk
from tkinter import filedialog, messagebox
import json
import os

# Función para seleccionar una imagen
def seleccionar_imagen():
    # Abre un cuadro de diálogo para seleccionar un archivo
    ruta_imagen = filedialog.askopenfilename(
        title="Selecciona una imagen",
        filetypes=[("Image files", "*.jpg *.jpeg *.png *.gif")]
    )
    return ruta_imagen

# Función para agregar un producto
def agregar_producto(nombre, categoria, precio):
    imagen = seleccionar_imagen()
    
    if not imagen:
        messagebox.showerror("Error", "No se seleccionó ninguna imagen.")
        return

    ruta_base = "C:/xampp/htdocs"
    if imagen.startswith(ruta_base):
        imagen = imagen[len(ruta_base):]

    # Crear un objeto de producto
    producto = {
        "nombre": nombre,
        "categoria": categoria,
        "precio": precio,
        "imagen": imagen
    }

    # Guardar el producto en productos.json
    if os.path.exists("backend/productos.json"):
        with open("backend/productos.json", "r") as f:
            productos = json.load(f)
    else:
        productos = []

    productos.append(producto)

    with open("backend/productos.json", "w") as f:
        json.dump(productos, f, indent=4)

    messagebox.showinfo("Éxito", f"Producto agregado: {producto['nombre']}")

# Interfaz mejorada
def crear_interfaz():
    root = tk.Tk()
    root.title("Agregar Producto")
    root.geometry("300x250")  # Tamaño de la ventana
    root.configure(bg="#f0f0f0")  # Color de fondo

    # Etiquetas y campos de entrada
    tk.Label(root, text="Nombre:", bg="#f0f0f0").pack(pady=5)
    nombre_entry = tk.Entry(root)
    nombre_entry.pack(pady=5)

    tk.Label(root, text="Categoría:", bg="#f0f0f0").pack(pady=5)
    categoria_entry = tk.Entry(root)
    categoria_entry.pack(pady=5)

    tk.Label(root, text="Precio:", bg="#f0f0f0").pack(pady=5)
    precio_entry = tk.Entry(root)
    precio_entry.pack(pady=5)

    # Botón para agregar producto
    agregar_button = tk.Button(root, text="Agregar Producto", bg="#4CAF50", fg="white",
                                command=lambda: agregar_producto(
                                    nombre_entry.get(),
                                    categoria_entry.get(),
                                    float(precio_entry.get())
                                ))
    agregar_button.pack(pady=15)

    root.mainloop()

if __name__ == "__main__":
    crear_interfaz()
