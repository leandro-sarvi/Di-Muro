/* ========================================================================= */
/*  Preloader Script
/* =========================================================================

window.onload = function () {
    document.getElementById('loading-mask').style.display = 'none';
} */
let productos = new carrito();
let añadirCarrito = document.getElementById('productos');
let closeModal = document.getElementById('closeModal');
let closeModalEnvio = document.getElementById('closeModalEnvio');
let btnCarrito = document.getElementById('btnCarrito');
let vaciarCarrito = document.getElementById('vaciar-carrito');
let confirmarPedido = document.getElementById('confirmar-pedido');
let envioWhatsapp = document.getElementById('envioWhatsapp');
añadirCarrito.addEventListener('click',(e)=>productos.comprarProducto(e));
let array = [];
/** EVENTOOS **/
document.addEventListener('DOMContentLoaded', async(e)=>{
    productos.leerLocalStorageCompra();
    productos.calcularTotal();
    onGetTasks((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          array.push({title:task.title,id:doc.id,precio:task.precio,imagen:task.imagen});
        });
        productos.cargarProductos(array);
    });
    
});

closeModal.addEventListener('click',()=>{
    modalCarrito.classList.toggle('hidden');
});
btnCarrito.addEventListener('click', showCarrito);

items.addEventListener('click',(e)=>productos.eliminarProducto(e));
items.addEventListener('click',(e)=>{
    productos.obtenerEvento(e);
    productos.calcularTotal();
});
vaciarCarrito.addEventListener('click',(e)=>productos.vaciarCarrito(e));
confirmarPedido.addEventListener('click',()=>{
    modalCarrito.classList.toggle('hidden');
    modalEnvio.classList.toggle('hidden');
});
closeModalEnvio.addEventListener('click',()=>{
    modalEnvio.classList.toggle('hidden');
});
envioWhatsapp.addEventListener('click',()=>productos.procesarCompra());
/*---------------- FUNCIONES ---------- */
function showCarrito(){
    if (productos.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacio',
            text: 'Añade un producto',
            timer: 1000,
            showConfirmButton: false
        })
    } else {
        modalCarrito.classList.toggle('hidden');
    }
}
$(function(){
    /* ========================================================================= */
    /*  Menu item highlighting
    /* ========================================================================= */

    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() > 400) {
            jQuery("#navigation").css("background-color","#00304E");
            jQuery("#navigation").addClass("animated-nav");
        } else {
            jQuery("#navigation").css("background-color","transparent");
            jQuery("#navigation").removeClass("animated-nav");
        }
    });

    $('#nav').onePageNav({
        filter: ':not(.external)',
        scrollSpeed: 950,
        scrollThreshold: 1
    });

    // Slider Height
    var slideHeight = $(window).height();
    $('#home-carousel .carousel-inner .item, #home-carousel .video-container').css('height',slideHeight);

    $(window).resize(function(){'use strict',
        $('#home-carousel .carousel-inner .item, #home-carousel .video-container').css('height',slideHeight);
    });

    // portfolio filtering

    $("#projects").mixItUp();

    //fancybox

    $(".fancybox").fancybox({
        padding: 0,

        openEffect : 'elastic',
        openSpeed  : 650,

        closeEffect : 'elastic',
        closeSpeed  : 550,
    });


    /* ========================================================================= */
    /*  Facts count
    /* ========================================================================= */

    "use strict";
    $(".fact-item").appear(function () {
        $(".fact-item [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });

/* ========================================================================= */
/*  On scroll fade/bounce fffect
/* ========================================================================= */

    $("#testimonial").owlCarousel({
        pagination : true, // Show bullet pagination
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true
    });

});

/* ---------------------------------------------------------------------- */
/*      Progress Bars
/* ---------------------------------------------------------------------- */

initProgress('.progress');

function initProgress(el){
    jQuery(el).each(function(){
        var pData = jQuery(this).data('progress');
        progress(pData,jQuery(this));
    });
}


            
function progress(percent, $element) {
    var progressBarWidth = 0;
    
    (function myLoop (i,max) {
        progressBarWidth = i * $element.width() / 100;
        setTimeout(function () {   
        $element.find('div').find('small').html(i+'%');
        $element.find('div').width(progressBarWidth);
        if (++i<=max) myLoop(i,max);     
        }, 10)
    })(0,percent);  
}   



    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    import {
      getFirestore,
      collection,
      getDocs,
      onSnapshot,
      addDoc,
      deleteDoc,
      doc,
      getDoc,
      updateDoc,
    } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
    
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDO0NMjGfOtY28A1omgtRf-OGHODTIXuE4",
        authDomain: "di-muro.firebaseapp.com",
        projectId: "di-muro",
        storageBucket: "di-muro.appspot.com",
        messagingSenderId: "23088781035",
        appId: "1:23088781035:web:23715e143d836737a750ae"
      };
    
    // Initialize Firebase
    export const app = initializeApp(firebaseConfig);
    
    export const db = getFirestore();
    
    /**
     * Save a New Task in Firestore
     * @param {string} title the title of the Task
     * @param {string} description the description of the Task
     */
    export const saveTask = (title, precio, imagen, description) =>
      addDoc(collection(db, "productos"), { title, precio, imagen});
    
    export const onGetTasks = (callback) =>
      onSnapshot(collection(db, "productos"), callback);
    
    /**
     *
     * @param {string} id Task ID
     */
    export const deleteTask = (id) => deleteDoc(doc(db, "productos", id));
    
    export const getTask = (id) => getDoc(doc(db, "productos", id));
    
    export const updateTask = (id, newFields) =>
      updateDoc(doc(db, "productos", id), newFields);
    
    export const getTasks = () => getDocs(collection(db, "productos"));