<div align="center">
  <img width="1200" height="350" alt="Maule Leña Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<h1 align="center">Maule Leña</h1>

<p align="center">
  <strong>Calor que nace de la tierra</strong><br />
  Plataforma de comercio electrónico para la compra de leña certificada, pellet y parafina en la Región del Maule, Chile.
</p>

---

## Acerca del proyecto

Maule Leña es un prototipo de tienda en línea desarrollado para facilitar la compra de productos de calefacción en el Maule. Los usuarios pueden explorar un catálogo de productos, calcular costos de despacho según su comuna, realizar pedidos y dar seguimiento a su estado.

## Funcionalidades

- **Catálogo con filtros** — Productos organizados por categoría: leña, pellet y parafina. Cada producto muestra precio, unidad, rating y badges informativos.
- **Carrito y checkout** — Flujo completo de compra: agregar productos, ajustar cantidades, calcular costo de despacho y confirmar el pedido con datos de entrega.
- **Seguimiento de pedidos** — Cada pedido avanza por los estados pendiente, en camino y entregado. Incluye historial de cambios y opción para repetir un pedido anterior.
- **Calculadora de consumo** — Herramienta interactiva que estima la cantidad de leña necesaria según las características del hogar.
- **Directorio de proveedores** — Listado de comerciantes locales por comuna con información de contacto directo.

## Tecnologías

| Tecnología | Propósito |
|---|---|
| React 19 | Interfaz de usuario basada en componentes |
| TypeScript | Tipado y seguridad en el código |
| Vite | Empaquetado rápido y recarga en caliente |
| Tailwind CSS v4 | Estilos con tema claro y oscuro |
| Motion | Animaciones y transiciones |
| Lucide React | Iconos |
| LocalStorage | Almacenamiento de pedidos en el navegador |

## Cómo empezar

Requiere Node.js instalado.

```bash
npm install
npm run dev
```

La aplicación se abre en [http://localhost:3000](http://localhost:3000).

### Compilar para producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
  components/      Componentes reutilizables
  screens/         Pantallas de la aplicación
  utils/           Lógica de negocio y utilidades
  data.ts          Productos y costos de despacho
  merchants.ts     Directorio de proveedores
  types.ts         Tipos compartidos
  App.tsx          Componente raíz con navegación y estado global
  main.tsx         Punto de entrada
```

## Despliegue

Conecta el repositorio a Vercel o Netlify. Vite detecta la configuración automáticamente y el proyecto está listo para desplegar sin pasos adicionales.

## Próximos pasos

- Integración real con Webpay o Mercado Pago
- Notificaciones por WhatsApp
- Autenticación de usuarios
- Panel de administración para comerciantes
- Aplicación móvil nativa

---

<p align="center">
  Maule Leña &copy; 2025<br />
  Prototipo en desarrollo
</p>
