let lProductosS1 = [];

CargarPrendas() ;

function CargarPrendas(){
  const urlJson = "prendas.json";
  $.getJSON(urlJson, function (respuesta, estado) {

    console.log( "JSON Data: " + respuesta );

   if (estado === "success") {
     lProductosS1 = respuesta;
     CargarProductos();
   }
 });


}


function CargarProductos() {
  

  let html1 = "";
  let html2 = "";

  let listVal = "";

  for (let productoS1 of lProductosS1) {
    if (parseInt(productoS1.sku, 10) <= 16) {
      html1 = html1 + "<div>";
      html1 =
        html1 +
        " <img src='imagen/" +
        productoS1.nombre_img +
        "' alt=''  class='img-fluid img-thumbnail' max-width='100%' height='auto' /> ";

      html1 = html1 + "<div>";
      html1 = html1 + "<h4>";
      html1 = html1 + productoS1.nombre;
      html1 = html1 + "s/." + productoS1.precio;
      html1 = html1 + "</h4>";
      html1 = html1 + "</div> ";

      html1 = html1 + "<div>";
      html1 =
        html1 +
        "<button type='button' class='btn btn-danger btn-block classbtn_det' id='btn_" +
        productoS1.sku +
        "'>";
      html1 = html1 + "<i class='fa fa-save'></i> !Lo quiero! </button>";
      html1 = html1 + "<br>";
      html1 = html1 + "<br>";
      html1 = html1 + "</div> ";

      html1 = html1 + "</div> ";

      listVal = "";
      listVal =
        listVal +
        productoS1.sku +
        "|" +
        productoS1.nombre +
        "|" +
        productoS1.moneda +
        "|" +
        productoS1.precio +
        "|" +
        productoS1.nombre_img +
        "|" +
        productoS1.tipo +
        "|" +
        productoS1.detalle;
      html1 =
        html1 +
        " <input type='hidden' id=hd_det_" +
        productoS1.sku +
        " value='" +
        listVal +
        "'/>";
    }
  }
  document.getElementById("divSeccion1").innerHTML = html1;

  for (let productoS2 of lProductosS1) {
    if (parseInt(productoS2.sku, 10) >= 17) {
      html2 = html2 + "<div>";
      html2 =
        html2 +
        " <img src='imagen/" +
        productoS2.nombre_img +
        "' alt=''  class='img-fluid img-thumbnail' max-width='100%' height='auto' /> ";

      html2 = html2 + "<div>";
      html2 = html2 + "<h4>";
      html2 = html2 + productoS2.nombre;
      html2 = html2 + "s/." + productoS2.precio;
      html2 = html2 + "</h4>";
      html2 = html2 + "</div> ";

      html2 =
        html2 +
        "<button type='button' class='btn btn-danger btn-block classbtn_det' id='btn_" +
        productoS2.sku +
        "'>";
      html2 = html2 + "<i class='fa fa-save'></i> !Lo quiero! </button>";
      html2 = html2 + "<br>";
      html2 = html2 + "<br>";

      html2 = html2 + "</div> ";

      listVal = "";
      listVal =
        listVal +
        productoS2.sku +
        "|" +
        productoS2.nombre +
        "|" +
        productoS2.moneda +
        "|" +
        productoS2.precio +
        "|" +
        productoS2.nombre_img +
        "|" +
        productoS2.tipo +
        "|" +
        productoS2.detalle;
      html2 =
        html2 +
        " <input type='hidden' id=hd_det_" +
        productoS2.sku +
        " value='" +
        listVal +
        "'/>";
    }
  }
  document.getElementById("divSeccion2").innerHTML = html2;

  //localStorage.clear();

    var classBtn = document.getElementsByClassName("classbtn_det");
    let i = 0;
  for (i = 0; i < classBtn.length; i++) {
      classBtn[i].addEventListener("click", mostrarDetalleClick);
    }
  document.getElementById("divPrevisualizacion").style.display = "none";

  VisualizarCantidProductoCarrito();

}


function mostrarDetalleClick() {
  document.getElementById("divPrevisualizacion").style.display = "block";

  var arrbtnId = this.id.split("_");
  var codprod = "hd_det_" + arrbtnId[1];
  var det_prod = document.getElementById(codprod).value.split("|");

  document.getElementById("txt_sku").value = det_prod[0];
  document.getElementById("txt_producto").value =
    det_prod[1] + " : " + det_prod[5];
  document.getElementById("txt_precio").value = det_prod[3];

  document.getElementById("txt_cantidad").value = "";

  document.getElementById("imgVista").src = "imagen/" + det_prod[4];

  let hdivHeader = document.getElementById("divHeader").clientHeight;
  let hnavHeader = document.getElementById("navHeader").clientHeight;
  let hcarousel = document.getElementById("carouselExampleIndicators")
    .clientHeight;

  window.scrollTo(0, hdivHeader + hnavHeader + hcarousel);

 
}

//VisualizarCantidProductoCarrito();

document.getElementById("btn_solicitar").addEventListener("click", function () {
  let listproductoCarritoJson = localStorage.getItem("listProdCarrito");

  let qpedido = 0;
  let sku = document.getElementById("txt_sku").value;
  qpedido = document.getElementById("txt_cantidad").value;

  if (sku === "") {
    Swal.fire("Seleccione producto.");
    return false;
  }

  if (qpedido === "0" || qpedido === "") {
    Swal.fire("Ingrese cantidad pedido.");

    return false;
  }

  let ofindSku = lProductosS1.find((p) => p.sku === sku);

  let encontradoCarrito = false;
  if (ofindSku != null) {
    let listCarritoArray = [];
    if (listproductoCarritoJson != null) {
      listCarritoArray = JSON.parse(listproductoCarritoJson);

      listCarritoArray.forEach((item) => {
        if (item.sku === sku) {
          item.cant_pedido =
            parseInt(item.cant_pedido, 10) + parseInt(qpedido, 10);
          encontradoCarrito = true;
        }
      });
    }

    if (encontradoCarrito === false) {
      ofindSku.linea_pedido = LineaPedido(listCarritoArray) + 1;
      ofindSku.cant_pedido = qpedido;
      listCarritoArray.push(ofindSku);
    }

    localStorage.setItem("listProdCarrito", JSON.stringify(listCarritoArray));

    Swal.fire(
      "Producto adicionado al carrito. Cant. productos:" +
        listCarritoArray.length
    );
    document.getElementById("divPrevisualizacion").style.display = "none";

    VisualizarCantidProductoCarrito();
  }
});

function LineaPedido(listProd) {
  let max = 0;
  for (let producto of listProd) {
    if (producto.linea_pedido > max) {
      max = producto.linea_pedido;
    }
  }
  return max;
}

function VisualizarCantidProductoCarrito() {
  // localStorage.clear();

  let listproductoCarritoJson = localStorage.getItem("listProdCarrito");
  let listCarritoArray = [];
  let totProductos = 0;
  if (listproductoCarritoJson != null) {
    listCarritoArray = JSON.parse(listproductoCarritoJson);

    for (let producto of listCarritoArray) {
      totProductos = totProductos + parseInt(producto.cant_pedido, 10);
    }
  }

  document.getElementById("divCantCarrito").innerHTML = totProductos;
}
