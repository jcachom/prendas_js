ListarCarrito();

$(document).on("click", ".classbtn_delete", function (event) {
  let id = this.id;
  let sku = id.split("_")[2];

  Swal.fire({
    title: "Eliminar",
    text: "Está seguro de eliminar?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar"
  }).then(function (result) {
    if (result.value) {
      $("#tr_" + sku).css("background-color", "#ffca39");
      $("#tr_" + sku).fadeOut(1000, function () {
        $("#tr_" + sku).remove();

        actualizarItemCarritoStorage(sku, 0, "ELIMINAR");
      });
    }
  });
});

$(".classtxt_cantidad").change(function () {
  let idText = this.id;
  let arrId = idText.toString().split("_");
  let sku = arrId[2];
  let precio = $("#hd_precio_" + sku).val();
  let qpedido = $("#" + idText).val();
  if (qpedido === "") {
    qpedido = 0;
  }
  let subTotal = parseFloat(precio) * parseFloat(qpedido);
  $("#txt_subTotal_" + sku).val(subTotal);
  actualizarItemCarritoStorage(sku, qpedido, "ADICIONAR");
   
});

function actualizarItemCarritoStorage(sku, qpedido, accion) {
  let listproductoCarritoJson = localStorage.getItem("listProdCarrito");
  let listCarritoArray = [];
  listCarritoArray = JSON.parse(listproductoCarritoJson);

  switch (accion) {
    case "ADICIONAR":
      listCarritoArray.forEach((item) => {
        if (item.sku === sku) {
          item.cant_pedido = qpedido;
        }
      });

      break;
    case "ELIMINAR":
      listCarritoArray = listCarritoArray.filter(function (item) {
        return item.sku !== sku;
      });

      break;

    default:
      break;
  }

  localStorage.setItem("listProdCarrito", JSON.stringify(listCarritoArray));

  ActualizarSubTotales();
}

function ActualizarSubTotales() {
  let listproductoCarritoJson = localStorage.getItem("listProdCarrito");
  let listCarritoArray = [];
  listCarritoArray = JSON.parse(listproductoCarritoJson);
  let SubTotalImporte = 0;
  if (listCarritoArray !=null) {

    listCarritoArray.forEach((item) => {
      SubTotalImporte =
        SubTotalImporte + parseFloat(item.cant_pedido) * parseFloat(item.precio);
    });

  }


  let impuesto = parseFloat(
    Math.round(SubTotalImporte * 0.18 * 100) / 100
  ).toFixed(2);

  let totalCobro = parseFloat(SubTotalImporte) + parseFloat(impuesto);
  $("#txt_subtotal").val(SubTotalImporte);
  $("#txt_impuesto").val(impuesto);
  $("#txt_total").val(totalCobro);
}

function ListarCarrito() {
  // localStorage.clear();
  $("#tb_listCarritoBody").html("");

  let listproductoCarritoJson = localStorage.getItem("listProdCarrito");
  let listCarritoArray = [];
 
  if (listproductoCarritoJson != null) {
    listCarritoArray = JSON.parse(listproductoCarritoJson);

    let html = "";
    let botonEliminar = "";
    let inputCant = "";
    let txtSubTotal = "";
    let hdInput = "";
    for (let item of listCarritoArray) {
    

      botonEliminar =
        "<button type='button' id='btn_eliminar_" +
        item.sku +
        "' class='btn btn-sm mr-1 btn-outline-danger classbtn_delete'   title='Eliminar' ><i class='fa fa-trash'></i></button>";

      inputCant =
        "<input type='number' id='txt_eliminar_" +
        item.sku +
        "' value=" +
        item.cant_pedido +
        " class='form-control col-12 classtxt_cantidad' />";

      txtSubTotal =
        "<input type='number' id='txt_subTotal_" +
        item.sku +
        "' value=" +
        item.precio * item.cant_pedido +
        " class='form-control col-12 classtxt_SubTotal' disabled />";

      hdInput =
        " <input type='hidden' id=hd_precio_" +
        item.sku +
        " value='" +
        item.precio +
        "'/>";

      html =
        html +
        "<tr id='tr_" +
        item.sku +
        "' >" +
        "<td>" +
        item.sku +
        "</td>" +
        "<td>" +
        item.nombre +
        "</td>" +
        "<td>" +
     
        inputCant +
        "</td>" +
        "<td>" +
        item.precio +
        hdInput +
        "</td>" +
        "<td>" +
         
        txtSubTotal +
        "</td>" +
        "<td>" +
        botonEliminar +
        "</td>" +
        "</tr>";
    }

    $("#tb_listCarritoBody").html(html);
  
  }
  ActualizarSubTotales();
}


 
$(document).on("click", "#btn_confirmar", function (event) {
 
  Swal.fire({
    title: "Confirmar compra.",
    text: "Está seguro de la compra?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar"
  }).then(function (result) {
    if (result.value) {
      
 
      localStorage.clear();
      ListarCarrito();

      Swal.fire(
        "El comprobante ha sido enviado a su correo."          
      ); 

    }
  });
});


  

 
