# 📚 Biblioteca de Prompts – Contador 4.0

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)
![License](https://img.shields.io/badge/license-Copyright-lightgrey.svg?style=flat-square)

> **La herramienta definitiva para gestionar, personalizar y escalar tu librería de inteligencia artificial contable.**

---

## 🚀 Descripción del Proyecto

**Biblioteca de Prompts** es una aplicación web progresiva (PWA) diseñada como complemento práctico del E-book *"Contador 4.0: Sistema de Transformación con IA"*. 

A diferencia de la versión *Express* (que es de consulta), esta herramienta permite al usuario **crear, editar, guardar y organizar** sus propios prompts personalizados. Construida con una estética **Cyber-Tech / Dark Mode**, ofrece una experiencia de usuario inmersiva, profesional y libre de distracciones.

### 🔗 [Ver Demo en Vivo](https://contador4-biblioteca.vercel.app/)

---

## ✨ Características Principales

* **🎨 Diseño High-End Dark Mode:** Interfaz moderna con paleta de colores oscuros (Slate 900/800), acentos en Azul Neón y efectos de cristal (Glassmorphism).
* **⚡ Gestión CRUD:** Funcionalidad completa para Crear, Leer, Actualizar y Eliminar prompts.
* **🔍 Búsqueda Instantánea:** Filtro en tiempo real por título, contenido o contexto.
* **🏷️ Sistema de Filtrado:** Organización por frecuencia de uso (Diario, Semanal, Mensual, Ocasional).
* **📱 Totalmente Responsiva:** Se adapta perfectamente a móviles, tablets y escritorio.
* **🤖 Personaje 3D Integrado:** Mascota de marca flotante con animación CSS pura en el footer.
* **💾 Persistencia de Datos:** (Nota: *Aquí puedes especificar si usa LocalStorage o Google Sheets API según tu script.js*).

---

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido priorizando el rendimiento y la limpieza del código:

* **Frontend Core:** HTML5 Semántico + CSS3 Moderno (Variables CSS).
* **Estilos:** Tailwind CSS (vía CDN para utilidades rápidas) + CSS Personalizado para efectos avanzados (animaciones, glassmorphism).
* **Lógica:** Vanilla JavaScript (ES6+).
* **Iconografía:** SVG Icons & Emojis.
* **Fuentes:** Google Fonts (Poppins & Lato).
* **Despliegue:** Vercel.

---

## 📂 Estructura del Proyecto

```text
/
├── index.html          # Estructura principal y maquetación
├── style.css           # Estilos Dark Mode, animaciones y Grid
├── script.js           # Lógica de la aplicación (CRUD, Modales, Filtros)
├── manifest.json       # Configuración PWA
├── assets/             # Imágenes y recursos estáticos
│   ├── personaje-contador.png
│   └── favicon.svg
└── README.md           # Documentación
