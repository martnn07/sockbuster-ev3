# Sockbuster Video & Socks — Evaluación Sumativa 03

**Asignatura:** Modelamiento de Soluciones Informáticas (INACAP)

**Estudiante(s):** [Martín Trujillo]

**Sitio publicado:** PENDIENTE — reemplazar esta línea por el enlace directo de GitHub Pages (ejemplo de formato: `https://TU-USUARIO.github.io/sockbuster-ev3/`).

## ¿De qué trata?

Sockbuster es un prototipo de tienda online de calcetines con temáticas de películas, series y cultura pop. Es un ejercicio académico y **no realiza compras ni pagos reales**.

## Las 3 páginas

- `index.html`: inicio, presentación y nombre de los estudiantes.
- `catalogo.html`: productos, filtros, tallas, carrito, compra simulada, reseñas y administración de prueba.
- `diagramas.html`: cinco vistas de arquitectura UML 4+1 y explicación de cada una.

## Requerimientos

| Código | Función del prototipo |
|---|---|
| RF01 | Ver catálogo con imágenes ilustrativas, precios, stock, tallas y categorías. |
| RF02 | Añadir/quitar productos del carrito, cambiar cantidades y generar resumen con código único de pedido. |
| RF03 | Añadir modelos y modificar precio/stock en un panel de administración **de demostración**. |
| RF04 | Crear perfil de prueba y publicar reseñas de 1 a 5 estrellas con comentarios. |
| RNF01 | Preparado para publicar en un hosting estático como GitHub Pages. |
| RNF02 | GitHub Pages sirve el sitio por HTTPS; autenticación real con JWT queda como propuesta de arquitectura y **no está implementada**. |

## Modelo UML 4+1

1. **Vista lógica:** clases `Usuario`, `Calcetin`, `Pedido`, `DetallePedido` y `Resena`.
2. **Vista de desarrollo:** archivos HTML, CSS, JavaScript e imágenes SVG.
3. **Vista de procesos:** pasos para filtrar, agregar, verificar stock y generar un pedido.
4. **Vista física:** navegador + GitHub Pages + almacenamiento del navegador; servidor JWT futuro dibujado aparte.
5. **Escenarios (+1):** casos de uso de cliente, usuario de prueba y administrador demo.

Las imágenes están en `diagramas/` y los **archivos editables** de los diagramas se encuentran en `fuentes_uml/` (formato Graphviz DOT).

## Tecnologías usadas

HTML, CSS y JavaScript simple. El navegador guarda los datos de ejemplo con `localStorage`. No requiere instalar librerías ni conectar una base de datos.

## Cómo probar

1. Abre `index.html` en Chrome o Edge.
2. Haz clic en `Catálogo`.
3. Filtra por colección o talla y agrega un modelo al carrito.
4. Cambia la cantidad y simula la compra con un nombre de ejemplo.
5. Crea un perfil de prueba y publica una reseña.
6. Abre `Administración de inventario (demostración)` y edita un producto.
7. Revisa las cinco vistas en `Diagramas 4+1`.

**Importante sobre los datos:** Los cambios guardados en un navegador no se comparten con otras personas ni equipos. El perfil de prueba NO tiene contraseña ni autenticación real. No ingreses datos personales reales.

## Cómo publicar

Lee `GUIA_PASO_A_PASO.md`. Cuando el sitio ya esté publicado, edita la línea **Sitio publicado** de este README para dejar el enlace real. La evaluación pide entregar **solo la URL pública del repositorio**, y desde el README debe poderse abrir la página publicada.
