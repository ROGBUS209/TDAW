//CRUD
let idEliminar=0;
let idActualizar=0;

function actionCreate(){
    //alert("Crear nueva categoria");
    let nombreRubro = document.getElementById("nombre-rubro").value;
    ///////////////////////////////////////
    let tieneSubtemas = 0;
    if($("#si_subtemas").is("checked"))
    tieneSubtemas = 1;
    else
    tieneSubtemas = 0 ;
    ////////////////////////////////////////
    //Vamos a comunicarnos con el servidor
    $.ajax({  
        method:"POST",
        url: "AdminLTE-3.1.0/phpropios/crud-rubros.php",
        data: {
          rubro   : nombreRubro,
          subtemas: tieneSubtemas,//Temporal
          accion  : "create"
        },
        success: function( respuesta ) {
          //alert(respuesta);
          let miObjetoJSON = JSON.parse(respuesta);
          //.estado
          //.id
          //.mensaje

          if(miObjetoJSON.estado==1){
            //Agregamos el registro a la tabla

            let tabla=$("#example1").DataTable();
            let botones ='<a class="btn btn-warning btn-sm" href="#"><i class="fas fa-clock"></i></a>';
            botones +=' <a class="btn btn-primary btn-sm" href="#" data-toggle="modal" data-target="#modal-actualizar-rubro" onclick="identificaActualizar('+miObjetoJSON.id+');"><i class="fas fa-pencil-alt"></i></a>';
            botones +=' <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#modal-delete" onclick="identificaEliminar('+miObjetoJSON.id+');"><i class="fas fa-trash"></i></a>';
            
            if(tieneSubtemas==1)
            tabla.row.add([nombreRubro,"Si tiene subtemas",botones]).draw().node().id="renglon_"+miObjetoJSON.id;
            else
            tabla.row.add([nombreRubro,"No tiene subtemas",botones]).draw().node().id="renglon_"+miObjetoJSON.id;


            //Mostramos el mensaje al usuario
            toastr.success(miObjetoJSON.mensaje);
          }else{
            //Mandamos un error al usario
            toastr.error(miObjetoJSON.mensaje);
          }
        }
    });

}

function actionRead(){ 
  $.ajax({
    method:"POST",
    url: "AdminLTE-3.1.0/phpropios/crud-rubros.php",
    data: {
      accion: "read"
    },
    success: function( respuesta ) {
      //Agrear el listado de rubros a la tabla
      let miObjetoJSON = JSON.parse(respuesta);
      
      if(miObjetoJSON.estado==1){
        let tabla=$("#example1").DataTable();
        miObjetoJSON.rubros.forEach(rubro => {
          let botones ='<a class="btn btn-warning btn-sm" href="#"><i class="fas fa-clock"></i></a>';
              botones +=' <a class="btn btn-primary btn-sm" href="#" data-toggle="modal" data-target="#modal-actualizar-rubro" onclick="identificaActualizar('+rubro.id+');"><i class="fas fa-pencil-alt"></i></a>';
              botones +=' <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#modal-delete" onclick="identificaEliminar('+rubro.id+');"><i class="fas fa-trash"></i></a>';
          if(rubro.subtemas==1) 
            tabla.row.add([rubro.nombre_rubro,"Si tiene subtemas",botones]).draw().node().id="renglon_"+rubro.id;
          else
            tabla.row.add([rubro.nombre_rubro,"No tiene subtemas",botones]).draw().node().id="renglon_"+rubro.id;
        });
      }
    }
  });
} 

function actionUpdate() {
    ///////////////
    ///////////////////////////////////////
    let tieneSubtemas = 0;
    if($("#si_subtemas_actualizar").is("checked"))
    tieneSubtemas = 1;
    else
    tieneSubtemas = 0 ;
    ////////////////////////////////////////
    let nombreRubroActualizar = document.getElementById("nombre-rubro-actualizar").value;
    $.ajax({
      method:"POST",
      url: "AdminLTE-3.1.0/phpropios/crud-rubros.php",
      data: {
        id       : idActualizar,
        rubro    : nombreRubroActualizar,
        subtemas : tieneSubtemas,//Pendiente de implementar
        accion   : "update"

      },
      success: function( respuesta ) {
        //alert(respuesta);
        miObjetoJSON = JSON.parse(respuesta);
        if(miObjetoJSON.estado==1){
          //Debemos mostrar en la tabla los datos ya actualizados
          let tabla = $("#example1").DataTable();
         
          let temp  = tabla.row("#renglon_"+idActualizar).data();
          temp[0]   = nombreRubroActualizar

          if(tieneSubtemas==1)
          temp[1]   = "Si tiene subtemas";
          else
          temp[1]   = "NO tiene subtemas";

          tabla.row("#renglon_"+idActualizar).data(temp).draw();

          toastr.success(miObjetoJSON.mensaje);
        }else{
          toastr.error(miObjetoJSON.mensaje);
        }
      }
    });
}

function actionDelete() {
  
  $.ajax({
    method:"POST",
    url: "AdminLTE-3.1.0/phpropios/crud-rubros.php",
    data: {
      id: idEliminar,//Esta es mi variable global
      accion:"delete"
    },
    success: function( respuesta ) {
        //Actualizamos la tabla para no tener que actualizar la pagina
        let miObjetoJSON = JSON.parse(respuesta);
        if(miObjetoJSON.estado==1){//Se comprueba que se elimino del servidor
          let tabla=$("#example1").DataTable();
          tabla.row("#renglon_"+idEliminar).remove().draw();
          toastr.success(miObjetoJSON.mensaje);
        }else{
          toastr.error(miObjetoJSON.mensaje);
        }
    }
  });

}

function identificaEliminar(id){
  //Guardar en una variable global el id
  //alert(id);
  idEliminar=id;
}

function identificaActualizar(id){
  //alert(id);
  idActualizar = id;
  //Realizar solicitud al servidor para que regrese los datos
  $.ajax({
    method:"POST",
    url: "AdminLTE-3.1.0/phpropios/crud-rubros.php",
    data: {
      id: idActualizar,
      accion:"read-id"
    },
    success: function( respuesta ) {
      //alert(respuesta);
      let miObjetoJSON = JSON.parse(respuesta);
      if(miObjetoJSON.estado==1){
        //Mostrar en la ventana de Actualizar los datos recuperados del servidor
        let nombreRubroActualizar   = document.getElementById('nombre-rubro-actualizar');
        nombreRubroActualizar.value = miObjetoJSON.nombre_rubro;
        if(miObjetoJSON.subtemas==1)
$("#si_subtemas_actualizar").prop("checked", true);
else
$("#no_subtemas_actualizar").prop("checked", true);
      }else{
        toastr.error(miObjetoJSON.mensaje);
      }
    }
  });
}