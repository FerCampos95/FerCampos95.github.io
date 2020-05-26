let tituloHoja;
let btnEditarHoja;
// let btnAgregarHoja; quitado porque lo hago desde el select
let btnBorrarHoja;
let selectHoja= document.getElementById("select"); //seleccionador de hoja para añadir nota
let checkboxHoja;
let listaHojas= document.getElementById("hojas"); //ul con los LI de nombres de Hojas
let nombresHojas= new Array();
let nombreHoja;

let textoNota=document.getElementById("textarea");
let btnEditarNota;
let btnBorrarNota;
let btnAgregarNota= document.getElementById("btn-agregar-nota");
let listaNotas;

obtenerTitulos();
eventListeners();

//EVENT LISTENERS
function eventListeners(){
    selectHoja.addEventListener("change",agregarHoja);
    btnAgregarNota.addEventListener("click",agregarNota);
    textoNota.addEventListener("keyup",agregarNotaConEnter);

}


function agregarHoja(e){
    e.preventDefault();
    nombresHojas= JSON.parse(localStorage.getItem("titulosHojas"));
    if(nombresHojas===null)
        nombresHojas= new Array();

    if(selectHoja.value==="nueva hoja"){
        tituloHoja= window.prompt("Ingrese el título de la nueva Hoja");
        
        if(tituloHoja !==null && tituloHoja.trim() !=="")
        {
            ///ACA METO EL CODIGO PARA AGREGAR UNA NUEVA CLAVE ->VALOR
            nombresHojas.push(tituloHoja);
            
            if(localStorage.getItem(tituloHoja)===null){
                localStorage.setItem("titulosHojas",JSON.stringify(nombresHojas));// aca guardo la lista de titulos
                localStorage.setItem(tituloHoja,JSON.stringify(null)); //aca voy a guardar las notas de ese titulo
                crearNuevaHoja(tituloHoja);
            }else{
                window.alert("Error ya hay una hoja con el nombre: "+tituloHoja);
            }
        }else{
            return false;
        }
    }
    return true;
}

function agregarNotaConEnter(e){
    e.preventDefault();
    if(e.key=== "Enter"){
        agregarNota(e);
        textoNota=document.getElementById("textarea");
        textoNota.value="Aqui puede ingresar su nota...";
    }
}

function agregarNota(e){
    e.preventDefault();
    nombreHoja= selectHoja.value;
    
    if(nombreHoja==="null"){ //null hardcodeado en el select(opcion ->seleecione su hoja)
        window.alert("Error debe seleccionar una hoja en donde insertar la nota");
        return;
    }
    if(nombreHoja==="nueva hoja"){ //por si el selector se quedo en nueva hoja va a pedir agregarla
        if(agregarHoja(e)){ //si agrega la hoja sigo para crear la nota sino salgo
            nombreHoja= selectHoja.value; ///vuelvo a agarrar el valor que creo el agregarHoja
        }else{
            window.alert("Debe seleccionar una hoja o crear una nueva");
            return;
        }
    }
    let uldeHoja= document.getElementById("ul"+nombreHoja);
    textoNota= document.getElementById("textarea").value;

    listaNotas= obtenerLocalStorage(nombreHoja)///esto reemplazaria las 3 lineas de arriba
    listaNotas.push(textoNota);
    localStorage.setItem(nombreHoja, JSON.stringify(listaNotas)); //ya guarde en local storage

    nuevoLI= crearNota(textoNota);
    uldeHoja.appendChild(nuevoLI);

}
//FIN DE EVENT LISTENERS

function crearNuevaHoja(tituloHoja){ //CREA LA HOJA VISUAL Y LOS ACCESOS A LA IZQUIERDA
    let nuevoLI;
    let nuevoCheckbox;
    let nuevoLabel;
    let nuevobtnEditar;
    let nuevobtnBorrar;
    let nuevaOpcion;

    //primero añado la opcion de la hoja al select
    nuevaOpcion= document.createElement("option");
    nuevaOpcion.innerText=tituloHoja;
    nuevaOpcion.value=tituloHoja;
    nuevaOpcion.selected=true; //hago que la opcion quede seleccionada
    selectHoja.appendChild(nuevaOpcion);

    nuevoCheckbox= document.createElement("input");
    nuevoLabel= document.createElement("label");
    nuevobtnEditar= document.createElement("button");
    nuevobtnBorrar= document.createElement("button");
    
    nuevoCheckbox.className="lista-checkbox";
    nuevoCheckbox.type="checkbox";
    nuevoCheckbox.checked=true;

    nuevoLabel.className="lista-label";
    nuevoLabel.innerText= tituloHoja;

    nuevobtnEditar.className="lista-btn-editar";
    nuevobtnEditar.innerText="E";
    
    nuevobtnBorrar.className="lista-btn-borrar";
    nuevobtnBorrar.innerText="X";
    
    nuevoLI= document.createElement("li");
    nuevoLI.className="lista-hojas";
    nuevoLI.appendChild(nuevoCheckbox);
    nuevoLI.appendChild(nuevoLabel);
    nuevoLI.appendChild(nuevobtnEditar);
    nuevoLI.appendChild(nuevobtnBorrar);
    nuevoLI.addEventListener("click",ocultaMuestraHoja);


    listaHojas.appendChild(nuevoLI);
    ///YA CREE LA HOJA EL EL SITIO DE MIS HOJAS
    
    //AHORA CREO EL CUERPO DE LA HOJA PARA VISUALIZAR LA NOTAS DE ESA HOJA
    //se lo tengo que agregar al id "content"
    let divPadreHojas= document.getElementById("content"); ///padre donde estan todas las hojas (el de la clase post)
    
    let divPost= document.createElement("div");
    divPost.className="post";
    divPost.id= tituloHoja; //para poder mostrar y dejar de mostrarlo

    let h2Titulo= document.createElement("h2"); //creo el titulo y le asigno su clase
    h2Titulo.innerText= tituloHoja;
    h2Titulo.className="title";

    let divContenedorUL= document.createElement("div"); //este es el div que contiene los ul
    divContenedorUL.className="entry";
    
    let ulContenedorNotas= document.createElement("ul");
    ulContenedorNotas.className="padre-lista-notas"; //para poder ingresar notas en el después
    ulContenedorNotas.id= "ul"+tituloHoja;
    
    divContenedorUL.appendChild(ulContenedorNotas); //1
    divPost.appendChild(h2Titulo);                  //2
    divPost.appendChild(divContenedorUL);           //3
    divPadreHojas.appendChild(divPost);             //4
    //con 1 2 3 4 finalizo la creacion de la hoja visual sin las notas


    //la nota se agregara cuando presiono agregar
}

function crearNota(textoNota){
    nuevoLI= document.createElement("li");
    nuevoLI.className="lista-notas";
    
    nuevoLabel=document.createElement("label");
    nuevoLabel.className="lista-label";
    nuevoLabel.innerText= textoNota; ///texto agarrado del textarea

    nuevobtnEditar= document.createElement("button");
    nuevobtnEditar.innerText="E";
    nuevobtnEditar.className="lista-boton-editar";

    nuevobtnBorrar= document.createElement("button");
    nuevobtnBorrar.innerText="X";
    nuevobtnBorrar.className="lista-btn-borrar";

    nuevoLI.appendChild(nuevoLabel);
    nuevoLI.appendChild(nuevobtnEditar);
    nuevoLI.appendChild(nuevobtnBorrar);
    return nuevoLI;
}

function ocultaMuestraHoja(e){
    // e.preventDefault(); //no lo uso xq inhabilita el on off del checkbox
    if(e.target.className=== "lista-checkbox"){
        // console.log(e); //muestra el evento
        // console.log(e.path[1]); //muestra la ruta del evento
        //console.log(e.path[1].childNodes[1]);//muestra el segundo elemento(en este caso el label)
        nombreHoja = e.path[1].childNodes[1].innerText; ///con esto obtengo el nombre del titulo de la hoja
        checkboxHoja= e.path[1].childNodes[0];

        let hoja= document.getElementById(nombreHoja);
        if(checkboxHoja.checked==false){ //significa que lo acaban de apagar
            hoja.hidden=true;
        }else{
            hoja.hidden=false;
        }
    }

}




//////////////////////FUNCIONES PARA CARGAR LOCALSTORAGE A LA PAGINA///////////////////
function obtenerTitulos(){
    nombresHojas= JSON.parse(localStorage.getItem("titulosHojas"));
    
    if(nombresHojas!==null){
        nombresHojas.sort();
        nombresHojas.forEach(function(nombre){
            crearNuevaHoja(nombre);
            obtenerNotasdeTitulo(nombre);
        });
    }else{
        nombresHojas= new Array();
    }
}
// function obtenerNotasdeTitulo(nombreHoja){ //REEMPLAZADA POR LA DE ABAJO
//     // listaNotas= JSON.parse(localStorage.getItem(nombreHoja) ); //REEMPLAZAR POR obtenerLocalStorage(clave)
    
//     let uldeHoja= document.getElementById("ul"+nombreHoja);
//     if(listaNotas!==null){
//         listaNotas.forEach(function(nota){
//             let notaCreada= crearNota(nota);//tendria que colocarle a donde va
//             uldeHoja.appendChild(notaCreada);
//         });
//     }
// } 

function obtenerNotasdeTitulo(nombreHoja){
    listaNotas= obtenerLocalStorage(nombreHoja);
    let uldeHoja= document.getElementById("ul"+nombreHoja);

    listaNotas.forEach(function(nota){
        let notaCreada= crearNota(nota);//tendria que colocarle a donde va
        uldeHoja.appendChild(notaCreada);
    });

}


///////////////////////////////////////////OBTENER DE LOCAL STORAGE///////////////////////////////
function obtenerLocalStorage(clave){
    let respuesta=  JSON.parse(localStorage.getItem(clave));

    if(respuesta===null)
        return new Array();
    
    return respuesta;
}