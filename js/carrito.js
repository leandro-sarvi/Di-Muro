let items = document.getElementById('itemContenedor');
let totalCant = document.getElementById('totalCant');
let listaProducts = document.getElementById('conte-productos');
let ssub = document.getElementById('sub');
let modalCarrito = document.getElementById('lista-carrito');
let totSub = document.getElementById('totSub');
let modalEnvio = document.getElementById('lista-envio');
let orderName = document.getElementById('orderName');
let orderAddress = document.getElementById('orderAddress');
let orderReference = document.getElementById('orderReference');
let orderLocalidad = document.getElementById('orderLocalidad');
class carrito {
//Añadir el producto al carrito
comprarProducto(e) {
    e.preventDefault();
    //Verificamos que contenga la clase agregar-carrito
    if (e.target.classList.contains("agregar-carrito")) {
        const producto = e.target.parentElement;
        this.leerDatosProducto(producto);
    }
}
leerDatosProducto(producto) {
    const infoProducto = {
        titulo: producto.querySelector('.info-producto h3').textContent,
        precio: producto.querySelector('#price').textContent,
        id: producto.querySelector('button').getAttribute('data-id'),
        cantidad: producto.querySelector('input').value
    }
    //comprobamos productos repetidos
    if(infoProducto.cantidad >=1){
        let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function (productoLS) {
        if (productoLS.id === infoProducto.id) {
            productosLS = productoLS.id;
        }
    });
    if (productosLS === infoProducto.id) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El producto ya esta agregado',
            text: 'Modifica la cantidad en el carrito',
            timer: 1500,
            showConfirmButton: false
        })
    }
    else {
        this.insertarCarrito(infoProducto);
    }
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'CANTIDAD NO VALIDA',
            timer: 1500,
            showConfirmButton: false
        })
    }
}
insertarCarrito(producto) {
    const rows = document.createElement('div');
    rows.classList.add('item-card');
    rows.innerHTML = `
<div class="info-item">
  <div class="titulo">
    <h5>${producto.titulo}</h5>
  </div>
  <span id="subtotales">$${producto.precio}</span>
  <div class="next">
    <em><i class="fas fa-minus-circle menos"></i></em>
    <input type="number" min="1" value="${producto.cantidad}">
    <em><i class="fas fa-plus-circle mas"></i></em>
  </div>
  <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
</div>
`;
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Producto añadido'
    });
    items.appendChild(rows);
    this.guardarProductosLocalStorage(producto);
    this.calcularTotal();
}
eliminarProducto(e) {
    e.preventDefault();
    let producto, productoId;
    if (e.target.classList.contains("borrar-producto")) {
        producto = e.target.parentElement.parentElement;
        productoId = producto.querySelector("a").getAttribute("data-id");
        e.target.parentElement.parentElement.remove();
    }
    this.eliminarProductoLocalStorage(productoId);
    if (this.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacio',
            text: 'Añade un producto',
            timer: 1000,
            showConfirmButton: false
        })
        modalCarrito.classList.toggle('hidden');
        this.calcularTotal();
    }
}
vaciarCarrito(e) {
    e.preventDefault();
    Swal.fire({
        title: 'Estas seguro de vaciar el carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'VACIAR'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Carrito Vacio!',
                'Puedes agragar mas productos en el catalogo.',
                'success'
            )
            while (items.firstChild) {
                items.removeChild(items.firstChild);
            }
            this.vaciarLocalStorage();
            this.calcularTotal();
            modalCarrito.classList.toggle('hidden');
        }
    })
    return false;
}//---------LOCAL STORAGE---------------------
guardarProductosLocalStorage(producto) {
    let productos;
    productos = this.obtenerProductosLocalStorage();
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));
}
//Comprobar que hay elementos en el LS
obtenerProductosLocalStorage() {
    let productoLS;

    //Comprobamos LocalStorage
    if (localStorage.getItem('productos') === null) {
        productoLS = [];
    }
    else {
        productoLS = JSON.parse(localStorage.getItem('productos'));
    }
    return productoLS;
}
eliminarProductoLocalStorage(productoId) {
    let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function (productoLS, index) {
        if (productoLS.id === productoId) {
            productosLS.splice(index, 1);
        }
    });
    localStorage.setItem('productos', JSON.stringify(productosLS));
}
vaciarLocalStorage() {
    localStorage.clear();
}
leerLocalStorageCompra() {
    let productoLS = this.obtenerProductosLocalStorage();
    productoLS.forEach(function (producto) {
        const rows = document.createElement('div');
        rows.classList.add('item-card');
        rows.innerHTML = `
<div class="info-item">
  <div class="titulo">
    <h5>${producto.titulo}</h5>
  </div>
  <span id="subtotales">${producto.precio * producto.cantidad}</span>
  <div class="next">
    <em><i class="fas fa-minus-circle menos"></i></em>
    <input type="number" min="1" value="${producto.cantidad}">
    <em><i class="fas fa-plus-circle mas"></i></em>
  </div>
  <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
</div>
`;
        items.appendChild(rows);
    });
}
calcularTotal() {
    let productoLS;
    let total = 0, cantidad = 0;
    productoLS = this.obtenerProductosLocalStorage();

    for (let i = 0; i < productoLS.length; i++) {
        let element = Number(productoLS[i].precio * productoLS[i].cantidad);
        total = total + element;

        cantidad =Number(cantidad) + Number(productoLS[i].cantidad);
    }
    totalCarrito.textContent = '$' + total.toFixed(1);
    ssub.innerHTML = `$${total.toFixed(1)}`;
    totSub.innerHTML = `$${total.toFixed(1)}`;
    totalCant.textContent='';
    totalCant.innerHTML = `${cantidad}`;
}

obtenerEvento(e) {
    e.preventDefault();
    let id, value, producto, productosLS;
    if (e.target.classList.contains("mas")) {
        producto = e.target.parentElement.parentElement.parentElement;
        id = producto.querySelector('a').getAttribute('data-id');
        value = parseInt(producto.querySelector('input').value);
        value++;
        producto.querySelector('input').value = value;
        let actualizarMontos = producto.querySelector('#subtotales');
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS, index) {
            if (productoLS.id === id) {
                productoLS.cantidad = value;
                actualizarMontos.innerHTML = Number(value * productosLS[index].precio).toFixed(1);
            }
        });
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }
    if (e.target.classList.contains("menos")) {
        producto = e.target.parentElement.parentElement.parentElement;
        id = producto.querySelector('a').getAttribute('data-id');
        value = parseInt(producto.querySelector('input').value);
        if (value > 1) {
            value = value - 1;
            producto.querySelector('input').value = value;
            let actualizarMontos = producto.querySelector('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = value;
                    actualizarMontos.innerHTML = Number(value * productosLS[index].precio).toFixed(1);
                }
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));
        }
    }
}
procesarCompra() {
    if (this.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacio',
            text: 'Añade un producto',
            timer: 1500,
            showConfirmButton: false
        }).then(function () {
            modalEnvio.classList.toggle('hidden');
        });
    } else if (orderName.value === '' || orderAddress.value === '' || orderReference === '' || orderLocalidad.value === '') {
        Swal.fire({
            icon: 'error',
            title: 'Datos',
            text: 'Completa los campos vacios',
            timer: 1500,
            showConfirmButton: false
        })
    } else {
        let total = 0;
        let productosLS = this.obtenerProductosLocalStorage();
        let v = productosLS.map(element => {
            return `*($${element.precio}) ${element.cantidad}X ${element.titulo}%0A`;
        });
        for (let i = 0; i < productosLS.length; i++) {
            let element = Number(productosLS[i].precio * productosLS[i].cantidad);
            total = total + element;
        }
        let metodo = "";
        if(document.getElementById('efectivo').checked){
            metodo = document.getElementById('efectivo').value;
        }else{
            metodo = document.getElementById('tarjeta').value;
        }
        let url = `https://api.whatsapp.com/send?phone=${541157002255}&text=*_PERFORACIONES DI MURO_*%0A%0A%3A+http%3A%2F%2Fperforacionesdimuro.vercel.app%2F%0A%0A*_DETALLE DEL PEDIDO_*%0A%0A${v.join('')}%0A%0A*_MÉTODO DE PAGO_*%0A${metodo}%0A%0A*DATOS DE CONTACTO*%0A%0A**Nombre completo**%0A${orderName.value}%0A**Dirección**%0A${orderAddress.value}%0A**Entre calles**%0A${orderReference.value}%0A*Localidad*%0A${orderLocalidad.value}%0A*TOTAL: %0A$${total}*%0A`;
        window.open(url);
        modalEnvio.classList.toggle('hidden');
    }
}
cargarProductos(productosCarrito) {
    productosCarrito.forEach(function (producto) {
        const rows = document.createElement('div');
        rows.classList.add('card');
        rows.innerHTML = `
        <img src="${producto.imagen}" alt="">
        <div class="info-producto">
            <h3>${producto.title}</h3>
        </div>
        <div class="cantidad">
            <input type="number" name="cantidad" id="" min="1" value="1">
        </div>
        <h4>$<span id="price">1000</span></h4>
        <button class="agregar-carrito" data-id="${producto.id}">Añadir <i class="fas fa-shopping-cart"></i></button>
  `;
        listaProducts.appendChild(rows);
    });
}
}
