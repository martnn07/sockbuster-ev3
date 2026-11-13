/* Funciones del catálogo. Es una tienda de prueba, no cobra dinero. */
// Los datos se guardan en ESTE navegador con localStorage (no en una base de datos real).
const CLAVE_PRODUCTOS = 'sockbuster_productos_v1';
const CLAVE_CARRITO = 'sockbuster_carrito_v1';
const CLAVE_PERFIL = 'sockbuster_perfil_v1';
const CLAVE_RESENAS = 'sockbuster_resenas_v1';
const CLAVE_PEDIDOS = 'sockbuster_pedidos_v1';

function leer(clave, valorInicial) {
  try { const texto = localStorage.getItem(clave); return texto ? JSON.parse(texto) : valorInicial; }
  catch (error) { return valorInicial; }
}
function guardar(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); }
  catch (error) { alert('El navegador no pudo guardar los datos.'); }
}
function textoSeguro(valor) {
  return String(valor).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function precioCLP(numero) { return Number(numero).toLocaleString('es-CL', {style:'currency',currency:'CLP',maximumFractionDigits:0}); }
function buscarProducto(id) { return productos.find(p => p.id === id); }
function cantidadCarrito(id, talla) {
  return carrito.filter(i => i.id === id && (talla === undefined || i.talla === talla)).reduce((s,i)=>s+i.cantidad,0);
}
let productos = leer(CLAVE_PRODUCTOS, window.PRODUCTOS_INICIALES.map(p=>({...p})));
let carrito = leer(CLAVE_CARRITO, []);
let perfil = leer(CLAVE_PERFIL, '');
let resenas = leer(CLAVE_RESENAS, []);
let productoResenas = null;

// 1. Mostrar productos y aplicar los filtros.
function mostrarProductos() {
  const busqueda = document.querySelector('#buscar').value.trim().toLowerCase();
  const categoria = document.querySelector('#filtro-categoria').value;
  const talla = document.querySelector('#filtro-talla').value;
  const encontrados = productos.filter(p =>
    (categoria === 'Todas' || p.categoria === categoria) &&
    (talla === 'Todas' || p.tallas.includes(talla)) &&
    (p.nombre + ' ' + p.inspiracion).toLowerCase().includes(busqueda));
  document.querySelector('#contador-productos').textContent = encontrados.length + ' modelo(s)';
  document.querySelector('#sin-productos').classList.toggle('oculto', encontrados.length !== 0);
  document.querySelector('#productos').innerHTML = encontrados.map(p => {
    const opciones = p.tallas.map(t => `<option value="${textoSeguro(t)}">Talla ${textoSeguro(t)}</option>`).join('');
    const opiniones = resenas.filter(r => r.productoId === p.id);
    const estrellas = opiniones.length ? (opiniones.reduce((s,r)=>s+r.estrellas,0)/opiniones.length).toFixed(1) + ' / 5' : 'Sin opiniones';
    const fotosPermitidas = ['nebulosa','videoclub','episodio','planeta','cometa','monstruo','modelo-generico'];
    const tipoFoto = (p.imagen || '').split('/').pop().replace('.svg','');
    const foto = fotosPermitidas.includes(tipoFoto) ? 'imagenes/' + tipoFoto + '.svg' : 'imagenes/modelo-generico.svg';
    return `<article class="producto">
      <div class="producto-imagen"><img src="${foto}" alt="Imagen ilustrativa de los calcetines ${textoSeguro(p.nombre)}"><span class="categoria">${textoSeguro(p.categoria)}</span></div>
      <div class="producto-cuerpo"><h3>${textoSeguro(p.nombre)}</h3><p class="inspiracion">${textoSeguro(p.inspiracion)}</p>
      <div class="precio-linea"><strong>${precioCLP(p.precio)}</strong><span class="stock ${p.stock===0?'cero':''}">${p.stock>0?'Stock: '+p.stock:'Agotado'}</span></div>
      <div class="producto-acciones"><select aria-label="Elegir talla para ${textoSeguro(p.nombre)}" class="talla-producto">${opciones}</select><input type="number" aria-label="Cantidad" class="cantidad-producto" min="1" max="99" value="1"></div>
      <button type="button" class="boton boton-primario agregar-producto" data-id="${p.id}" ${p.stock===0?'disabled':''}>Agregar al carrito +</button>
      <div class="producto-detalle"><button type="button" class="quitar abrir-resenas" data-id="${p.id}">Ver y escribir reseñas ↗</button><p class="resumen-resenas">★ ${textoSeguro(estrellas)} · ${opiniones.length} opinión(es)</p></div></div>
      </article>`;
  }).join('');
}

// 2. Agregar productos al carrito sin superar el stock disponible.
function agregarAlCarrito(id, talla, cantidad) {
  const p = buscarProducto(id);
  if (!p || !p.tallas.includes(talla) || !Number.isInteger(cantidad) || cantidad < 1) return;
  if (cantidadCarrito(id) + cantidad > p.stock) { alert('No hay suficiente stock de este modelo.'); return; }
  const item = carrito.find(i=>i.id===id && i.talla===talla);
  if (item) item.cantidad += cantidad;
  else carrito.push({id, talla, cantidad});
  guardar(CLAVE_CARRITO, carrito);
  mostrarCarrito();
}
function mostrarCarrito() {
  carrito = carrito.filter(i=>buscarProducto(i.id));
  const cant = carrito.reduce((s,i)=>s+i.cantidad,0);
  document.querySelector('#contador-carrito').textContent = '('+cant+')';
  document.querySelector('#total-articulos').textContent = cant + ' artículo(s)';
  const total = carrito.reduce((s,i)=>s + buscarProducto(i.id).precio*i.cantidad,0);
  document.querySelector('#total-carrito').textContent = precioCLP(total);
  document.querySelector('#items-carrito').innerHTML = carrito.length ? carrito.map(i=>{
    const p=buscarProducto(i.id);
    return `<div class="linea-carrito" data-id="${i.id}" data-talla="${textoSeguro(i.talla)}"><div><strong>${textoSeguro(p.nombre)}</strong><small>Talla ${textoSeguro(i.talla)} · ${precioCLP(p.precio)}</small><div class="fila-cantidad"><button class="menos" aria-label="Restar una unidad">−</button><small>${i.cantidad}</small><button class="mas" aria-label="Sumar una unidad">+</button></div></div><div><strong>${precioCLP(p.precio*i.cantidad)}</strong><button class="quitar sacar" aria-label="Eliminar este producto">Quitar</button></div></div>`;
  }).join('') : '<p class="carrito-vacio">Tu carrito está vacío.<br>Agrega algún modelo.</p>';
}
function cambiarCantidad(id,talla,cambio) {
  const item=carrito.find(i=>i.id===id && i.talla===talla);
  if (!item) return;
  const proxima=item.cantidad+cambio;
  if (proxima>buscarProducto(id).stock) {alert('No hay más unidades disponibles.');return;}
  if (proxima<=0) carrito=carrito.filter(i=>i!==item);
  else item.cantidad=proxima;
  guardar(CLAVE_CARRITO,carrito);mostrarCarrito();
}

// 3. Realizar una COMPRA SIMULADA con identificador único.
function finalizarCompra() {
  const nombre=document.querySelector('#nombre-pedido').value.trim();
  if (!carrito.length) {alert('El carrito está vacío.');return;}
  if (!nombre) {alert('Escribe un nombre de ejemplo para el pedido.');return;}
  for (const item of carrito) {
    const p=buscarProducto(item.id);
    if(!p || cantidadCarrito(item.id)>p.stock){alert('El stock cambió. Revisa tu carrito.');return;}
  }
  const total=carrito.reduce((s,i)=>s+buscarProducto(i.id).precio*i.cantidad,0);
  const codigo='SB-'+Date.now().toString(36).toUpperCase()+'-'+Math.floor(Math.random()*900+100);
  const detalle=carrito.map(i=>({nombre:buscarProducto(i.id).nombre,talla:i.talla,cantidad:i.cantidad}));
  const pedidos=leer(CLAVE_PEDIDOS,[]);
  pedidos.push({codigo,nombre,total,detalle,fecha:new Date().toISOString()});
  guardar(CLAVE_PEDIDOS,pedidos);
  for(const item of carrito) buscarProducto(item.id).stock-=item.cantidad;
  guardar(CLAVE_PRODUCTOS,productos);
  carrito=[];guardar(CLAVE_CARRITO,carrito);
  mostrarProductos();mostrarCarrito();mostrarAdmin();
  const caja=document.querySelector('#resultado-pedido');
  caja.classList.remove('oculto');
  caja.innerHTML='<b>¡Pedido de prueba generado!</b><strong>'+textoSeguro(codigo)+'</strong><span>Cliente: '+textoSeguro(nombre)+'<br>Total: '+precioCLP(total)+'<br>'+detalle.map(i=>textoSeguro(i.nombre)+' (talla '+textoSeguro(i.talla)+') x '+i.cantidad).join('<br>')+'</span><p>Pago aprobado solo en la simulación. No hubo cobro real.</p>';
}

// 4. Crear perfil demo y publicar comentarios con 1 a 5 estrellas.
function mostrarPerfil() {
  document.querySelector('#perfil-actual').textContent=perfil ? 'Perfil demo: '+perfil : 'Sin perfil demo';
  document.querySelector('#perfil-nombre').value=perfil;
}
function mostrarResenas(id) {
  const p=buscarProducto(id);if(!p)return;
  productoResenas=id;
  const lista=resenas.filter(r=>r.productoId===id);
  document.querySelector('#panel-resenas').innerHTML=`<h3>Reseñas de ${textoSeguro(p.nombre)}</h3><div class="resena-lista">${lista.length?lista.map(r=>`<div class="una-resena"><strong>${textoSeguro(r.nombre)}</strong> <span>${'★'.repeat(r.estrellas)}${'☆'.repeat(5-r.estrellas)}</span><p>${textoSeguro(r.comentario)}</p></div>`).join(''):'<p>Aún no hay reseñas de este modelo.</p>'}</div><form id="form-resena" class="resena-form"><label>Calificación<select id="resena-estrellas" required><option value="5">5 estrellas</option><option value="4">4 estrellas</option><option value="3">3 estrellas</option><option value="2">2 estrellas</option><option value="1">1 estrella</option></select></label><label>Comentario<textarea id="resena-texto" maxlength="250" placeholder="Me gustó este diseño porque..." required></textarea></label><button class="boton boton-primario" type="submit">Publicar reseña</button></form>`;
  document.querySelector('#panel-resenas').scrollIntoView({behavior:'smooth',block:'center'});
}
function publicarResena(event) {
  event.preventDefault();
  if (!perfil) {alert('Primero crea tu perfil de prueba.');return;}
  const estrellas=Number(document.querySelector('#resena-estrellas').value);
  const comentario=document.querySelector('#resena-texto').value.trim();
  if(!comentario || comentario.length>250 || estrellas<1 || estrellas>5)return;
  resenas.push({productoId:productoResenas,nombre:perfil,estrellas,comentario});
  guardar(CLAVE_RESENAS,resenas);mostrarProductos();mostrarResenas(productoResenas);
}

// 5. Administración DEMO: agregar productos, cambiar precio y stock.
function mostrarAdmin() {
  document.querySelector('#tabla-admin').innerHTML=productos.map(p=>`<div class="admin-fila" data-id="${p.id}"><strong>${textoSeguro(p.nombre)}</strong><input aria-label="Precio ${textoSeguro(p.nombre)}" class="admin-precio" type="number" min="500" max="100000" value="${p.precio}"><input aria-label="Stock ${textoSeguro(p.nombre)}" class="admin-stock" type="number" min="0" max="10000" value="${p.stock}"><button type="button" class="guardar-cambios">Guardar</button></div>`).join('');
}
function agregarProducto(event) {
  event.preventDefault();
  const nombre=document.querySelector('#nuevo-nombre').value.trim();
  const inspiracion=document.querySelector('#nuevo-inspiracion').value.trim();
  const categoria=document.querySelector('#nuevo-categoria').value;
  const precio=Number(document.querySelector('#nuevo-precio').value);
  const stock=Number(document.querySelector('#nuevo-stock').value);
  if(!nombre || !inspiracion || !Number.isInteger(precio) || precio<500 || !Number.isInteger(stock) || stock<0)return;
  productos.push({id:'SB'+Date.now(),nombre,inspiracion,categoria,precio,stock,tallas:['S','M','L'],imagen:'imagenes/modelo-generico.svg'});
  guardar(CLAVE_PRODUCTOS,productos);mostrarProductos();mostrarAdmin();event.target.reset();alert('Modelo agregado al catálogo de prueba.');
}
function guardarEdicion(fila) {
  const p=buscarProducto(fila.dataset.id);if(!p)return;
  const precio=Number(fila.querySelector('.admin-precio').value);
  const stock=Number(fila.querySelector('.admin-stock').value);
  if(!Number.isInteger(precio)||precio<500||precio>100000||!Number.isInteger(stock)||stock<0||stock>10000){alert('Revisa precio y stock.');return;}
  if(cantidadCarrito(p.id)>stock){alert('El stock no puede ser menor a lo que ya está en el carrito.');return;}
  p.precio=precio;p.stock=stock;guardar(CLAVE_PRODUCTOS,productos);mostrarProductos();mostrarCarrito();alert('Producto actualizado.');
}

// Conectar los botones HTML con las funciones JavaScript.
document.querySelectorAll('#buscar,#filtro-categoria,#filtro-talla').forEach(campo=>campo.addEventListener('input',mostrarProductos));
document.querySelector('#productos').addEventListener('click',event=>{
  const agregar=event.target.closest('.agregar-producto');
  if(agregar){const card=agregar.closest('.producto');const talla=card.querySelector('.talla-producto').value;const cantidad=Number(card.querySelector('.cantidad-producto').value);agregarAlCarrito(agregar.dataset.id,talla,cantidad);}
  const abrir=event.target.closest('.abrir-resenas');if(abrir)mostrarResenas(abrir.dataset.id);
});
document.querySelector('#items-carrito').addEventListener('click',event=>{
  const boton=event.target.closest('button');if(!boton)return;
  const linea=boton.closest('.linea-carrito');if(!linea)return;
  const {id,talla}=linea.dataset;
  if(boton.classList.contains('mas'))cambiarCantidad(id,talla,1);
  if(boton.classList.contains('menos'))cambiarCantidad(id,talla,-1);
  if(boton.classList.contains('sacar')){carrito=carrito.filter(i=>!(i.id===id&&i.talla===talla));guardar(CLAVE_CARRITO,carrito);mostrarCarrito();}
});
document.querySelector('#finalizar').addEventListener('click',finalizarCompra);
document.querySelector('#guardar-perfil').addEventListener('click',()=>{
  const nombre=document.querySelector('#perfil-nombre').value.trim();
  if(!nombre){alert('Escribe un nombre de ejemplo.');return;}
  perfil=nombre;guardar(CLAVE_PERFIL,perfil);mostrarPerfil();alert('Perfil de prueba creado. Ya puedes publicar reseñas.');
});
document.querySelector('#panel-resenas').addEventListener('submit',event=>{if(event.target.id==='form-resena')publicarResena(event);});
document.querySelector('#form-producto').addEventListener('submit',agregarProducto);
document.querySelector('#tabla-admin').addEventListener('click',event=>{if(event.target.classList.contains('guardar-cambios'))guardarEdicion(event.target.closest('.admin-fila'));});
document.querySelector('#reiniciar-demo').addEventListener('click',()=>{
  if(!confirm('¿Restablecer modelos y borrar el carrito de prueba?'))return;
  productos=window.PRODUCTOS_INICIALES.map(p=>({...p}));carrito=[];
  guardar(CLAVE_PRODUCTOS,productos);guardar(CLAVE_CARRITO,carrito);
  mostrarProductos();mostrarCarrito();mostrarAdmin();
});
mostrarProductos();mostrarCarrito();mostrarPerfil();mostrarAdmin();
