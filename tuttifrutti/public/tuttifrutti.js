const socket= io();
const TIMEOUTESPERA=1000;
const TIEMPOESPERALANZAMIENTOJUEGO=6000;
const VALORVACIO=0;//son los puntajes por palabras
const VALORREPETIDO=5;//repetidas
const VALORUNICO=10;//unicas



let datosUsuario={
    nombreUsuario:"",
    salaUsuario:"Ninguna-Sala",
    puntajeUsuario:0
}
////////////////////////////////////////////////LOGIN//////////////////////////////////////////////
//VARIABLES     //Login
let inputUsuario= document.getElementById("input-usuario");
let btnIniciarSesion= document.getElementById("btn-iniciar");
let labelCaracteres= document.getElementById("label-caracteres");
let requisitosUsuario= document.getElementById("requisitos");
let listaUsuarios= new Array();
let listaUsuariosMiSala= new Array;
let usuario="";
let divUsuariosYSalas= document.getElementById("info");

//LISTENERS
inputUsuario.addEventListener("keyup",validarUsuario);
inputUsuario.addEventListener("keyup", iniciarConEnter);
btnIniciarSesion.addEventListener("click",iniciarSesion);

//FUNCIONES
function iniciarConEnter(e){
    if(e.keyCode==13){//significa que presiono enter
        iniciarSesion(e);
    }
}
function validarUsuario(e){
    e.preventDefault();
    usuario= inputUsuario.value;

    labelCaracteres.innerText=usuario.length + "-";

    if(inputUsuario.value.split(" ").length>1){
        requisitosUsuario.innerText="Error, el nombre de usuario no puede tener espacios";
        inputUsuario.style.color="red";
        return false;
    }

    if(usuario.length > 12 || usuario=="" || usuario==null || usuario==undefined || usuario.trim()==""){
        requisitosUsuario.innerText="Error, el nombre de usuario debe tener entre 1 y 12 Caracteres";
        inputUsuario.style.color="red";
        return false;
    }else{
        requisitosUsuario.innerText="Ingrese su nombre de Usuario (1-12 Caracteres)";
        inputUsuario.style.color="green";
    }

    return true;
}
function iniciarSesion(e){
    e.preventDefault();
    if(validarUsuario(e)){
        let salir=false;
        listaUsuarios.forEach( (u)=>{
            if(usuario==u.nombreUsuario){
                requisitosUsuario.innerText="Lo siento, el nombre de usuario ya esta en uso. Intente otro";
                inputUsuario.focus();
                salir=true;
            }
        })
        if(salir)
            return;

        socket.emit("nuevoConectado",usuario);
        document.getElementById("login").style.display="none";
        mostrarUsuariosYSalas();
        datosUsuario.nombreUsuario=usuario;
    }
}

///ESCUCHAS DEL SOCKET
socket.on("pedirConectados", (data)=>{
    listaUsuarios= data;
    
    // console.log(listaUsuarios);
    let ulConectados= document.getElementById("ul-conectados");
    while(ulConectados.firstChild){
        ulConectados.removeChild(ulConectados.firstChild);
    }

    //agarrando datos de mi propio usuario
    let mio= listaUsuarios.find( listaUsuarios => listaUsuarios.nombreUsuario==datosUsuario.nombreUsuario);
    if(mio!= undefined){ //porque cuando inicia pide los conectados y no me encuentra
        datosUsuario.salaUsuario=mio.nombreSala; //xq quizas cambio de sala
        datosUsuario.puntajeUsuario= mio.puntajeUsuario;//actualizo mi puntaje
    }

    listaUsuariosMiSala=new Array();
    // cantConectadosEnMiSala=0;
    listaUsuarios.forEach( (u)=>{
        if(u.nombreSala== datosUsuario.salaUsuario){  //si uno de esos esta en mi sala
            listaUsuariosMiSala.push(u); //lo agrego en la lista de mi sala
            // cantConectadosEnMiSala++;
        }
        
        let liConectado= document.createElement("li");
        liConectado.className="li-conectados";
        liConectado.id="li-conectados";

        let pNombre= document.createElement("p");
        pNombre.innerText=u.nombreUsuario;

        let pSala = document.createElement("p");
        pSala.innerText=u.nombreSala;

        liConectado.appendChild(pNombre);
        liConectado.appendChild(pSala);

        ulConectados.appendChild(liConectado);
    })

})


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////SALAS////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//VARIABLES     //Salas
let btnCrearSala= document.getElementById("btn-crear-sala");
let btnUnirse= document.getElementsByClassName("btn-unirse");
let divSalas= document.getElementById("salas");
let modalCrearSala= document.getElementById("modal-crear-sala");
let btnFinalizarCrearSala= document.getElementById("btn-finalizar-crear-sala");
let btnCancelarCrearSala= document.getElementById("btn-cancelar-crear-sala");
let inputNombreSala= document.getElementById("input-crear-sala");
let labelCaracteresSala= document.getElementById("label-caracteres-sala");
let pRequisitosSala= document.getElementById("requisitos-sala");
let listaSalas=new Array();
let nombreSala="";
//VARIABLES         //Salas seleccionada
let btnSalirDeSala= document.getElementById("btn-salir-sala");
let tituloDeSala = document.getElementById("titulo-sala");
let divSalaSeleccionada = document.getElementById("sala-seleccionada");
let cantConectadosEnMiSala=0;
let abandonador="ALGUIEN" //es la variable para guardar quien se desconecto

//LISTENERS
btnCrearSala.addEventListener("click",mostrarCrearSala);
btnFinalizarCrearSala.addEventListener("click", crearSala);
btnCancelarCrearSala.addEventListener("click", ocultarCrearSala);
inputNombreSala.addEventListener("keyup",validarSala);
inputNombreSala.addEventListener("keyup",crearSalaConEnter);

btnSalirDeSala.addEventListener("click", salirDeSala);

//FUNCIONES
function mostrarCrearSala(e){
    if(datosUsuario.salaUsuario=="Ninguna-Sala"){//si no tiene sala puede crear
        divSalas.classList.add("oculto");
        modalCrearSala.classList.remove("oculto");
        inputNombreSala.focus();
    }else{
        window.alert("Usted ya se encuentra en una sala, no puede crear otra");
    }
    
}
function ocultarCrearSala(e){
    divSalas.classList.remove("oculto");
    modalCrearSala.classList.add("oculto");
}

function validarSala(e){
    nombreSala= inputNombreSala.value;
    labelCaracteresSala.innerText= nombreSala.length + "-";

    if(nombreSala.length >30 || nombreSala=="" || nombreSala==null || nombreSala==undefined || nombreSala.trim()==""){
        pRequisitosSala.innerText="Error, el nombre de la debe tener entre 1 y 30 Caracteres";
        inputNombreSala.style.color="red";

        return false;
    }else{
        letras=nombreSala.split(" ");
        if(letras.length>1){
            pRequisitosSala.innerText="El nombre no puede contener espacios";
            inputNombreSala.style.color="red";
            return false;
        }
        
        if(nombreSala=="Ninguna-Sala"){
            pRequisitosSala.innerText="Nombre de Sala no permitido, intente otro";
            inputNombreSala.style.color="red";
            return false;
        }

        let salir=false;
        listaSalas.forEach( (sala)=>{
            if(sala.nombreSala== nombreSala){
                pRequisitosSala.innerText="Nombre de Sala ya esta en uso, intente otro";
                inputNombreSala.style.color="red";
                salir=true;
            }
        })
        if(salir)//si tengo que salir es por el nombre estaba en uso
            return false;

        pRequisitosSala.innerText="Entre 1 y 30 Caracteres";
        inputNombreSala.style.color="green";
    }
    
    return true;
}

function crearSala(e){
    
    if(validarSala(e)){
        let info ={
            nombreSala: nombreSala,
            adminSala: usuario
        }
        socket.emit("nuevaSala",info);
        socket.emit("conectarseASala",nombreSala);
        tituloDeSala.innerText="Conectado a: "+nombreSala;
        // datosUsuario.salaUsuario=nombreSala; //no necesario xq lo hace en el pedir sala
        // socket.emit("categorias:PedirCategorias",nombreSala);
        let datos={
            nombreSala:nombreSala,
            listaReceptores:listaUsuariosMiSala,
            listaCategorias:listaCategorias
        }
        socket.emit("categorias:cambioCategorias",datos)//nombreSala //listaReceptores //listaCategorias
        btnEditarCategorias.classList.remove("oculto");
        ocultarCrearSala();
        mostrarSalaSeleccionada();
    }
    
}
function crearSalaConEnter(e){    
    if(e.keyCode==13){
        crearSala(e);
    }
}

function eventoUnirseSala(e){
    e.preventDefault();
    // console.log(datosUsuario.salaUsuario);
    
    if(e.target.className!=="btn-unirse"){//si la clase no es la del boton no hago nada
        return;
    }

    if(datosUsuario.salaUsuario=="Ninguna-Sala"){
        nombreSala="";
        e.target.parentElement.childNodes.forEach( (nodo)=>{ //recorro todos los childNodes hasta la clase sala
            if(nodo.className=="nombre-sala"){
                nombreSala=nodo.innerText;
            }
        })
        datosUsuario.salaUsuario=nombreSala;
        socket.emit("conectarseASala",nombreSala);
        socket.emit("actualizarMiSala",nombreSala);
        mostrarSalaSeleccionada();
        window.scroll(0,document.body.scrollHeight);//hace scroll hasta abajo de todo
        socket.emit("categorias:PedirCategorias",nombreSala);
        
        
        //PREPARO EL AVISO A LOS DEMAS PARTICIPANTES        
        setTimeout(() => {
            let tiempo=new Date();
            let datos={
                listaReceptores:listaUsuariosMiSala,
                usuario:datosUsuario.nombreUsuario,
                mensaje:"SE UNIÓ A ESTA SALA",
                hora:tiempo.getHours()+":"+tiempo.getMinutes()
            }
            socket.emit("enviarMensaje",datos); 
        }, TIMEOUTESPERA+1000);
    }else{
        window.alert("Usted ya se encuentra en una sala");
    }
        
}

function salirDeSala(){
    if(window.confirm("Seguro desea salir de la Sala? Su puntaje se perderá.")){//acepta salir de la sala
        socket.emit("salirDeSala");
        socket.emit("pedirConectados");
        socket.emit("pedirSalas");
        
        divSalaSeleccionada.style.display="none"; //mantengo oculta la sala
        socket.emit("actualizarMiSala",datosUsuario.salaUsuario);
    }
}

function mostrarSalaSeleccionada(){ divSalaSeleccionada.style.display="flex";}
function ocultarSalaSeleccionada(){ divSalaSeleccionada.style.display="none";}
function mostrarUsuariosYSalas(){ divUsuariosYSalas.style.display="flex"};
function ocultarUsuariosYSalas(){ divUsuariosYSalas.style.display="none"};

//ESCUCHAS DEL SOCKET
socket.on("pedirSalas",(data)=>{
    listaSalas= data;
            
    let ulSalas= document.getElementById("ul-salas");
    while(ulSalas.firstChild){
        ulSalas.removeChild(ulSalas.firstChild);
    }

    listaSalas.forEach( (sala)=>{
        let liSala= document.createElement("li");
        liSala.id="li-salas";
        liSala.className="li-salas";

        let btnUnirse= document.createElement("button");
        btnUnirse.className="btn-unirse";
        btnUnirse.innerText="Unirse";
        //debe ir un addeventlistener o en el li

        let pNombreSala= document.createElement("p");
        pNombreSala.innerText=sala.nombreSala;
        pNombreSala.className="nombre-sala"

        let pCantConectados= document.createElement("p");
        pCantConectados.innerText=sala.cantConectados; 
        
        liSala.appendChild(btnUnirse);
        liSala.appendChild(pNombreSala);
        liSala.appendChild(pCantConectados);

        liSala.addEventListener("click",eventoUnirseSala);
        ulSalas.appendChild(liSala);
    })
})
socket.on("elAbandonadorEs", (escrache)=>{
    abandonador=escrache;
})
socket.on("actualizarMiSala", (miSala)=>{
    setTimeout( ()=>{
        tituloDeSala.innerText="Conectado a: "+miSala;
        //listaUsuariosMiSala  -> esta variable la cargo con los usuarios q estan en mi sala al traer a los conectados
        let datosSala= listaSalas.find(listaSalas => listaSalas.nombreSala== miSala)//busco los datos de esta sala para obtener el admin
        let adminSala="";
        
        if(datosSala!==undefined){
            adminSala= datosSala.adminSala;
        }else{
            adminSala= datosUsuario.nombreUsuario;
        }

        let ulConectadosSala= document.getElementById("ul-conectados-sala");
        while(ulConectadosSala.firstChild){
            ulConectadosSala.removeChild(ulConectadosSala.firstChild);
        }

        // console.log(cantConectadosEnMiSala);
        if(listaUsuariosMiSala.length < cantConectadosEnMiSala){ //si disminuyen conectados mando el mensaje
            // setTimeout(() => {
                let tiempo=new Date();
                liMensaje= crearLiMensaje(abandonador,"ABANDONÓ ESTA SALA",tiempo.getHours()+":"+tiempo.getMinutes());
                liMensaje.classList.add("abandonado-la-sala");
                ulMensajes.appendChild(liMensaje);
                let divMensajes= document.getElementById("mensajes");
                divMensajes.scrollTop= divMensajes.scrollHeight;
                abandonador="nulo";
            // }, TIMEOUTESPERA+500);
        }
        cantConectadosEnMiSala=listaUsuariosMiSala.length;

        listaUsuariosMiSala.forEach( (u)=>{

            let liConectadoSala= document.createElement("li");
            liConectadoSala.id="li-conectados-sala";
            liConectadoSala.className="li-conectados-sala";

            let pNombre= document.createElement("p");
            pNombre.innerText=u.nombreUsuario;
            if(u.nombreUsuario==adminSala){
                pNombre.innerText+=" (ADMIN)";
            }

            let pPreparado= document.createElement("p");
            pPreparado.innerText= u.preparadoUsuario?"SI":"NO";

            let pPuntaje = document.createElement("p");
            pPuntaje.innerText=u.puntajeUsuario;

            liConectadoSala.appendChild(pNombre);
            liConectadoSala.appendChild(pPreparado);
            liConectadoSala.appendChild(pPuntaje);

            ulConectadosSala.appendChild(liConectadoSala);

        })
    },TIMEOUTESPERA);
})

/////////////////////////////////////////////////CHATS////////////////////////////////////////////////
/////////////////////////////////////////////////CHATS////////////////////////////////////////////////
/////////////////////////////////////////////////CHATS////////////////////////////////////////////////
/////////////////////////////////////////////////CHATS////////////////////////////////////////////////
/////////////////////////////////////////////////CHATS////////////////////////////////////////////////
/////////////////////////////////////////////////CHATS////////////////////////////////////////////////
/////////////////////////////////////////////////CHATS////////////////////////////////////////////////

//VARIABLES     //CHATS
let pEstado= document.getElementById("p-estado");//coloco quien esta escribiendo
let inputMensaje= document.getElementById("input-mensaje");
let btnEnviarMensaje= document.getElementById("btn-enviar-mensaje");
let ulMensajes= document.getElementById("ul-mensajes");
let liMensaje;
let mensaje="vacio"; //mensaje que escribe el usuario
let misEscritores= new Array();

///EVENT LISTENERS
btnEnviarMensaje.addEventListener("click",enviarMensaje);
inputMensaje.addEventListener("keyup",eventoTeclaInputMensaje);



//FUNCIONES CHATS
function enviarMensaje(e){
    mensaje= inputMensaje.value;
    
    if(mensaje=="" || mensaje==null || mensaje.trim()==""){
        return; //no envia el mensaje;
    }

    let tiempo=new Date();
    let datos={
        listaReceptores:listaUsuariosMiSala,
        usuario:datosUsuario.nombreUsuario,
        mensaje:mensaje,
        hora:tiempo.getHours()+":"+tiempo.getMinutes()
    }
    socket.emit("enviarMensaje",datos);    //emito el mensajes a los demas
    
    inputMensaje.value="";
    inputMensaje.focus();
}

function eventoTeclaInputMensaje(e){
    if(e.keyCode==13){  //quiere decir que la tecla era el enter
        enviarMensaje(e);
        //TAMBIEN TENGO QUE QUITAR AL ESCRITOR DE LA LISTA
        // return;
    }
    
    //caso contratrio aviso quien esta escribiendo

    console.log(misEscritores.find(misEscritores => datosUsuario.nombreUsuario));
    
    if(inputMensaje.value!==""){//tengo algo escrito
        if(misEscritores.find(misEscritores => datosUsuario.nombreUsuario)!==datosUsuario.nombreUsuario){ //si no estoy en la lista de escritores
            misEscritores.push(datosUsuario.nombreUsuario);//me agrego
        }
            
    }else{//no tengo algo escrito
        let miPosicion=misEscritores.indexOf(datosUsuario.nombreUsuario);//busco mi indice
        if(miPosicion !== -1){ //es decir, si estoy en la lista de escritores
            misEscritores.splice(miPosicion,1);//me elimino de la lista
        } 
    }

    let datos={
        listaReceptores:listaUsuariosMiSala,
        escritores: misEscritores
    }
    socket.emit("escribiendo",datos);

}

function crearLiMensaje(usuario,mensaje,hora){
    let liMensaje= document.createElement("li");
    liMensaje.classList.add("li-mensajes");

    let pUsuario= document.createElement("p");
    pUsuario.innerText= usuario;
    pUsuario.classList.add("usr");

    let pDosPuntos= document.createElement("p");
    pDosPuntos.innerText=":";

    let pMensaje= document.createElement("p");
    pMensaje.innerText= mensaje;
    pMensaje.classList.add("msj");

    let pHora= document.createElement("p");
    pHora.innerText= hora;
    pHora.classList.add("hora");

    liMensaje.appendChild(pUsuario);
    liMensaje.appendChild(pDosPuntos);
    liMensaje.appendChild(pMensaje);
    liMensaje.appendChild(pHora);

    return liMensaje;
}

///SOCKETS CHATS
socket.on("recibirMensaje", (datos)=>{ ///lo recibiria solo yo xq lo envian por id de socket
    // datos=> contiene el usuario,dos puntos, el mensaje y la hora
    let liMensaje= crearLiMensaje(datos.usuario,datos.mensaje,datos.hora);
    if(datosUsuario.nombreUsuario == datos.usuario){//si mi nombre es el mismo que el que envio
        liMensaje.classList.add("mensaje-mio");
    }else{
        // liMensaje.classList.add("mensaje-otro");
    }

    if(datos.mensaje== "SE UNIÓ A ESTA SALA"){
        liMensaje.classList.add("se-a-unido-a-sala");
    }else if(datos.mensaje=="ABANDONÓ LA SALA"){
        liMensaje.classList.add("abandonado-la-sala");
    }else if(datos.mensaje=="DETUVO EL JUEGO"){
        liMensaje.classList.add("detuvo-el-juego");
    }

    ulMensajes.appendChild(liMensaje);
    let divMensajes= document.getElementById("mensajes");
    divMensajes.scrollTop= divMensajes.scrollHeight;
})

socket.on("escribiendo", (escritores)=>{
    misEscritores=escritores;
    
    let miPosicion=escritores.indexOf(datosUsuario.nombreUsuario);//busco mi indice
    if(miPosicion !== -1){ //es decir, si estoy en el array
        escritores.splice(miPosicion,1);//me elimino del array
    }

    let estadoEscribiendo= document.getElementById("p-estado");
    let cantEscritores= escritores.length;
    console.log(escritores);

    if(cantEscritores ==0){
        estadoEscribiendo.innerText="Nadie escribe";
    }else if(cantEscritores ==1){
        estadoEscribiendo.innerText= escritores[0]+ " esta escribiendo";
    }else if(cantEscritores ==2){
        estadoEscribiendo.innerText= escritores[0]+" y "+escritores[1]+" estan escribiendo";
    }else if(cantEscritores >2){
        estadoEscribiendo.innerText= escritores[0]+", "+escritores[1]+" y "+(cantEscritores-2)+" más estan escribiendo";
    }
})


//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//////////////////////////JUEGO///////////////////////////////////////////////////////////////////////
//variables juego
let btnEditarCategorias= document.getElementById("editar-categorias-juego");
let btnAgregarCategiria= document.getElementById("agregar-categorias-juego");
let ulCategorias= document.getElementById("ul-categoria");
let listaCategorias=["Nombres","Colores","Cosas","Frutas/Verduras","Paises/Provincias","Peliculas/Series","Famosos","Animales"];
let btnIniciarCancelar= document.getElementById("btn-iniciar-cancelar");
let cantUsuariosPreparados= 0;
let gifContador= document.getElementById("contador-tiempo");
let juegoIniciado=true;
let btnBastaParaTodos= document.getElementById("btn-basta-para-todos");
let juegoLanzado=false;
let tablaResultados= document.getElementById("tabla-resultados");
let puntajes=new Array();
listaCategorias.forEach( ()=>{puntajes.push(0);});
let divFormularioJuego= document.getElementById("formulario-juego");
let btnAceptarResultados= document.getElementById("btn-aceptar-resultados");
let divResultados= document.getElementById("resultados");
let h2Letra=document.getElementById("titulo-letra");
let listaLetrasUsadas= new Array();


//EVENT LISTENERS JUEGO
btnEditarCategorias.addEventListener("click",iniciar_finalizar_EdicionCategorias);
btnAgregarCategiria.addEventListener("click",agregarCategoria);
btnIniciarCancelar.addEventListener("click",iniciar_cancelar);///manda la señal que el jugador esta preparado
btnBastaParaTodos.addEventListener("click",basta_para_todos);
tablaResultados.addEventListener("click",evento_tabla);
btnAceptarResultados.addEventListener("click",aceptarResultados);

//FUNCIONES JUEGO
function aceptarResultados(e){
    limpiarFormularioJuego();
    // divFormularioJuego.classList.remove("oculto");
    h2Letra.innerText="Esperando que acepte los resultados finales el administrador";
  
    let datos={//nombreUsuario //nombreSala //puntajesUsuario
        nombreUsuario:datosUsuario.nombreUsuario,
        nombreSala:datosUsuario.salaUsuario,
        puntajesUsuario:puntajes
    }
    socket.emit("juego:aceptarResultados", datos);//manda los resultados al servidor (PUNTAJES TOTALES);
}

function evento_tabla(e){
    let fila=e.path[1].rowIndex;
    let columna=e.path[0].cellIndex;
    // console.log("FILA: "+e.path[1].rowIndex);
    // console.log("COLUMNA: "+e.path[0].cellIndex);
    if(fila !==0 && columna!==0 && fila!==undefined && columna !==undefined && fila!==listaCategorias.length+1){
        // console.log(tablaResultados);
        // console.log(tablaResultados.childNodes[2].childNodes[0]);//es el tbody //obtengo los heads//primer fila
        //cells[columna]//primera fila (0 es head categoria)(1 primer head)(2 segundo heado)//serian las columnas
        //.textContent o innerText
        // console.log(tablaResultados.childNodes[2].childNodes[0].cells[columna].innerText);
        
        let celda= tablaResultados.childNodes[2].childNodes[fila].cells[columna]; //con esto obtengo la celda que hizo click
        let usuario= tablaResultados.childNodes[2].childNodes[0].cells[columna].innerText;//agarro el texto de la celda cabecera
        if(usuario==datosUsuario.nombreUsuario){//si toque mis celdas
            // console.log(tablaResultados.childNodes[2].childNodes[fila].cells[columna]);
            // celda.classList.add("unico");
            // listaClases=celda.className;
            // console.log(listaClases);
            if(celda.className=="unico"){
                celda.className="repetido";
                puntajes[fila-1]= VALORREPETIDO;
            }else if(celda.className=="repetido"){
                celda.className="vacio";
                puntajes[fila-1]= VALORVACIO;
            }else /*if(celda.className=="vacio")*/{
                celda.className="unico";
                puntajes[fila-1]= VALORUNICO;
            }

            //con cada click sumo los puntos
            let celdaPuntos= tablaResultados.childNodes[2].childNodes[listaCategorias.length+1].childNodes[columna+1];
            // console.log(celdaPuntos);
            let sumaPuntos=0;
            puntajes.forEach( (puntaje)=>{
                sumaPuntos+=puntaje;
            })
            celdaPuntos.innerText=sumaPuntos;

            let datos={
                listaReceptores:listaUsuariosMiSala,
                nombreUsuario:datosUsuario.nombreUsuario,
                puntajesUsuario:puntajes
            }
            socket.emit("juego:refrescarResultadosTabla",datos);

        }else{
            console.log("No podes tocar las celdas de los demas");
        }
        
        // console.log("fila: "+fila);
        // console.log("columna: "+columna);
    }

}
function refrescarTablaResultados(usuario,listaPuntajes){
    let fila=0;
    let columna=0;
    let sumaPuntos=0;
    //busco el usuario en la tabla
    let celdasUsuarios= tablaResultados.childNodes[2].childNodes[0].cells;
    
//    celdasUsuarios.forEach( (celdaUsuario,index)=>{
    for(let index=0; index<celdasUsuarios.length;index++){//recorro las celdas para encontrar el usuario
        if(celdasUsuarios[index].innerText==usuario){//si es el usuario que refresco su tabla
            columna=index;
            let celda;
            listaPuntajes.forEach( (puntaje,index)=>{
                fila=index+1;
                console.log("fila: "+fila);
                console.log("columna: "+columna);
                celda= tablaResultados.childNodes[2].childNodes[fila].cells[columna]; //con esto obtengo la celda que quiero pintar
                switch(puntaje){
                    case VALORVACIO: celda.className="vacio"; break;
                    case VALORREPETIDO:celda.className="repetido"; break;
                    case VALORUNICO: celda.className="unico";break;
                }
                sumaPuntos+=puntaje;
            })
            
            let celdaPuntos= tablaResultados.childNodes[2].childNodes[listaCategorias.length+1].childNodes[columna+1];
            celdaPuntos.innerText=sumaPuntos;
        }
    }
}

function chequearSiSoyAdmin(){
    let soyAdmin=false;
    listaSalas.forEach( (sala,index)=>{//recorro las salas
        if(sala.nombreSala== datosUsuario.salaUsuario){//si es mi sala
            if(sala.adminSala==datosUsuario.nombreUsuario){
                soyAdmin=true;
            }
        }
    })
    return soyAdmin;
}

function iniciar_finalizar_EdicionCategorias(e){
    e.preventDefault();
    let soyAdmin= chequearSiSoyAdmin();

    if(soyAdmin){
        if(btnEditarCategorias.value=="Editar Categorias"){
            mostrarBotonesEdicion();
            btnEditarCategorias.value="Finalizar Edicion";
            btnEditarCategorias.innerText="Finalizar Edicion";
            btnAgregarCategiria.classList.remove("oculto");
            btnIniciarCancelar.classList.add("oculto");
        }else{
            ocultarBotonesEdicion();
            btnEditarCategorias.value="Editar Categorias";
            btnEditarCategorias.innerText="Editar Categorias";
            btnAgregarCategiria.classList.add("oculto");
            btnIniciarCancelar.classList.remove("oculto");
            let datos={//listaReceptores //listaCategorias
                listaReceptores:listaUsuariosMiSala,
                listaCategorias:listaCategorias
            }
            socket.emit("categorias:cambioCategorias",datos);
        }
    }else{
        window.alert("Solo puede editar el administrador de la sala");
    }
}
function ocultarBotonesEdicion(){
    visibilidadBotones(document.getElementsByClassName("btn-subir-categoria"),false);
    visibilidadBotones(document.getElementsByClassName("btn-bajar-categoria"),false);
    visibilidadBotones(document.getElementsByClassName("btn-editar-categoria"),false);
    visibilidadBotones(document.getElementsByClassName("btn-quitar-categoria"),false);
}
function mostrarBotonesEdicion(){
    visibilidadBotones(document.getElementsByClassName("btn-subir-categoria"),true);
    visibilidadBotones(document.getElementsByClassName("btn-bajar-categoria"),true);
    visibilidadBotones(document.getElementsByClassName("btn-editar-categoria"),true);
    visibilidadBotones(document.getElementsByClassName("btn-quitar-categoria"),true);
}
function visibilidadBotones(btns,mostrar){
    if(mostrar){
        for(let i=0; i<btns.length;i++){
            btns[i].classList.remove("oculto");
        }
    }else{
        for(let i=0; i<btns.length;i++){
            btns[i].classList.add("oculto");
        }
    }
}
function agregarCategoria(e){
    let nuevaCategoria=window.prompt("Ingrese el nombre para la nueva categoria: ");
    if(nuevaCategoria!==null || nuevaCategoria.trim()!==""){
        listaCategorias.push(nuevaCategoria);
        crearLosLICategoria(listaCategorias);//vuelvo a crear los LI
    }else{
        // window.alert("Categoria No Valida");
    }
}
function accionBotonEdiciones(e){
    e.preventDefault();
    if(e.target.localName== "button"){
        let clase= e.target.className;//agarro la clase    
        
        let id=e.path[1].childNodes[0].id;//con esto agarro "cat-#"  #->es la posicion en la lista de categorias
        let posicion= parseInt(id.substring(id.length-1));

        switch(clase){//veo que boton presiona y llamo a esa accion
            case "btn-subir-categoria" : subirPosicionCategoria(posicion);break;
            case "btn-bajar-categoria" : bajarPosicionCategoria(posicion);break;
            case "btn-editar-categoria": editarPosicionCategoria(posicion);break;
            case "btn-quitar-categoria": quitarPosicionCategoria(posicion);break;
        }
    }//si no es boton no hago nada
}
function bajarPosicionCategoria(posicion){//aumentar su posicion en el array
    let nombreCategoria= listaCategorias[posicion];//me guardo el nombre de la categoria
    let posicionTope= listaCategorias.length;
    listaCategorias.splice(posicion,1);//elimino el elemento
    posicion++;//al aumentarle queda mas atras del array y se general el label mas tarde(queda +abajo)
    if(posicion==posicionTope)
        posicion=0;
    listaCategorias.splice(posicion,0,nombreCategoria);//la inserto en la nueva posicion
    crearLosLICategoria(listaCategorias);//vuelvo a crear los LI
}
function subirPosicionCategoria(posicion){ //disminuir su posicion en el array
    let nombreCategoria= listaCategorias[posicion];//conservo el nombre de la cat
    let posicionTope= listaCategorias.length-1;
    listaCategorias.splice(posicion,1);//elimino el elemento
    posicion--;
    if(posicion==-1)
        posicion=posicionTope;
        // return;    
    listaCategorias.splice(posicion,0,nombreCategoria);//la inserto en la nueva posicion
    crearLosLICategoria(listaCategorias);//vuelvo a crear los LI
}
function editarPosicionCategoria(posicion){
    // let nombreCategoria= listaCategorias[posicion];
    let nuevaCategoria=window.prompt("Ingrese el reemplazo para la categoria: "+listaCategorias[posicion]);
    if(nuevaCategoria!==null || nuevaCategoria.trim()!==""){
        listaCategorias.splice(posicion,1,nuevaCategoria);
        crearLosLICategoria(listaCategorias);//vuelvo a crear los LI
    }else{
        // window.alert("Categoria No Valida");
    }
}
function quitarPosicionCategoria(posicion){
    listaCategorias.splice(posicion,1);
    crearLosLICategoria(listaCategorias);//vuelvo a crear los LI
}

function crearLosLICategoria(categorias){
    if(chequearSiSoyAdmin()){
        btnEditarCategorias.classList.remove("oculto");
        // console.log("Soy admin");
        // console.log("MOSTRANDO EL EDITAR");
    }else{
        btnEditarCategorias.classList.add("oculto");
        // console.log("NO SOY ADMINISTRADOR");
    }

    //preparo el array de puntajes
    puntajes=new Array();
    categorias.forEach( ()=>{puntajes.push(0);});

    //limpio el ul
    while(ulCategorias.firstChild){
        ulCategorias.removeChild(ulCategorias.firstChild);
    }
    
    let liCategoria;
    categorias.forEach( (cat,index)=>{
        liCategoria= document.createElement("li");

        liCategoria.id="li-categoria";
        liCategoria.className="li-categoria";

        let labelCategoria= document.createElement("label");
        labelCategoria.innerText=cat;
        labelCategoria.id="cat-"+index;
        labelCategoria.className="label-categoria";

        let inputCategoria= document.createElement("input");
        inputCategoria.type="text";
        inputCategoria.id="input-"+index;
        inputCategoria.addEventListener("keydown", (e)=>{
            if(e.keyCode==13){
                if(document.getElementById("input-"+(index+1))){
                    document.getElementById("input-"+(index+1)).focus();
                }else{
                    document.getElementById("input-"+0).focus();
                }
            }
        })

        let btnSubir =document.createElement("button");
        btnSubir.innerText="Subir";
        btnSubir.classList.add("btn-subir-categoria");
        // btnSubir.classList.add("oculto");

        let btnBajar =document.createElement("button");
        btnBajar.innerText="Bajar";
        btnBajar.classList.add("btn-bajar-categoria");
        // btnBajar.classList.add("oculto");
        
        let btnEditar =document.createElement("button");
        btnEditar.innerText="Editar";
        btnEditar.classList.add("btn-editar-categoria");
        // btnEditar.classList.add("oculto");
        
        let btnQuitar =document.createElement("button");
        btnQuitar.innerText="Quitar";
        btnQuitar.classList.add("btn-quitar-categoria");
        // btnQuitar.classList.add("oculto");

        liCategoria.appendChild(labelCategoria);
        liCategoria.appendChild(inputCategoria);
        liCategoria.appendChild(btnSubir);
        liCategoria.appendChild(btnBajar);
        liCategoria.appendChild(btnEditar);
        liCategoria.appendChild(btnQuitar);

        liCategoria.addEventListener("click",accionBotonEdiciones);
        ulCategorias.appendChild(liCategoria);
    })
}

function iniciar_cancelar(e){
    if(btnIniciarCancelar.value=="iniciar"){
        socket.emit("actualizarMiSala",datosUsuario.salaUsuario);//mandarlo en el estoy listo
        // console.log("preparados :"+cantUsuariosPreparados);
        // console.log("conectados :"+cantConectadosEnMiSala);
        socket.emit("juego:yaIniciaron?",listaUsuariosMiSala);
        
        setTimeout( ()=>{//espera que cargue la respuesta de ya iniciaron?
            if(juegoIniciado){
                window.alert("El juego ya inicio espere un momento por favor");
                return;
            }
            if(chequearSiSoyAdmin()){
                btnEditarCategorias.classList.add("oculto");
            }
            console.log(listaUsuariosMiSala);
            let info={
                listaReceptores:listaUsuariosMiSala,
                nombrePreparado:datosUsuario.nombreUsuario,
                preparado:true
            }
            
            cargarJugadoresPreparados();
            socket.emit("juego:estoyListo",info);//mando a quienes le envio y mi nombre
            btnIniciarCancelar.value="cancelar";
            btnIniciarCancelar.innerText="Cancelar";
        },500);
    }else{//presiono cancelar
        socket.emit("actualizarMiSala",datosUsuario.salaUsuario);
        // btnEditarCategorias.classList.remove("oculto");

        // console.log(listaUsuariosMiSala);

        //aviso que no estoy preparado a los demas
        let info={ 
            listaReceptores:listaUsuariosMiSala,
            nombrePreparado:datosUsuario.nombreUsuario,
            preparado:false
        }
        socket.emit("juego:estoyListo",info);//mando los receptores, mi nombre, y true o false

        btnIniciarCancelar.value="iniciar";
        btnIniciarCancelar.innerText="Iniciar";
        cargarJugadoresPreparados();

        //le cargo a los demas que no estamos jugando
        let info2={
            receptores:listaUsuariosMiSala,
            jugando:false
        }
        socket.emit("juego:iniciado",info2);//cambia el estado de los conectados-> jugando a falso

        //aviso a los demas que cancele por mensaje
        let datos={
            listaReceptores:listaUsuariosMiSala,
            usuario:datosUsuario.nombreUsuario,
            mensaje:"DETUVO EL JUEGO",
            hora:""
        }
        socket.emit("enviarMensaje",datos);
    }
}
function cargarJugadoresPreparados(){
    cantUsuariosPreparados=0;
    listaUsuariosMiSala.forEach( (jugador)=>{
        if(jugador.preparadoUsuario==true){
            cantUsuariosPreparados++;
        }
    })
}

function lanzarElJuego(){
    // console.log("juego iniciado");
    let datos={
        receptores:listaUsuariosMiSala,
        jugando:true
    }
    socket.emit("juego:iniciado",datos);//cambia el estado de los conectados-> jugando a true

    ulCategorias.classList.add("oculto");
    gifContador.classList.remove("oculto");
    setTimeout(()=>{
        if(juegoLanzado){
            ulCategorias.classList.remove("oculto");
            gifContador.classList.add("oculto");
            btnIniciarCancelar.classList.add("oculto");
            btnBastaParaTodos.classList.remove("oculto");
            document.getElementById("input-0").focus();
            //HACER ESTO SI ES EL ADMIN
            let soyAdmin=chequearSiSoyAdmin();
            if(soyAdmin){
                socket.emit("juego:resetearResultadosSala",datosUsuario.salaUsuario);
                let datos={
                    listaLetrasUsadas:listaLetrasUsadas,
                    listaReceptores:listaUsuariosMiSala
                }
                socket.emit("juego:obtenerLetra",datos);
            }
        }
    },TIEMPOESPERALANZAMIENTOJUEGO);
}

function basta_para_todos(e){
    socket.emit("juego:robarResultados",listaUsuariosMiSala);//de todos incluido el mio

    juegoIniciado=false;
    juegoLanzado=false;

    socket.emit("juego:resetear",listaUsuariosMiSala);
}
function finalizarYReiniciarElJuego(){
    btnBastaParaTodos.classList.add("oculto");
    btnIniciarCancelar.classList.remove("oculto");
    btnIniciarCancelar.value="iniciar";
    btnIniciarCancelar.innerText="Iniciar";
    cantUsuariosPreparados=0;
    cantConectadosEnMiSala=listaUsuariosMiSala.length;
}
function ocultarDivFormularioJuego(){divFormularioJuego.className="oculto";};
function mostrarDivFormularioJuego(){h2Letra.innerText='Letra:"-"'; divFormularioJuego.classList.remove("oculto");};
function ocultarDivResultados(){ divResultados.className="oculto";};
function mostrarDivResultados(){ divResultados.classList.remove("oculto");};

function recopilarEnviarMisResultados(){
    let elemento=0;
    let resultado;
    let resultados= new Array();
    while(document.getElementById("input-"+elemento)!==null){
        resultado=document.getElementById("input-"+elemento);
        resultados.push(resultado.value);
        elemento++;
    }

    let datos={
        nombreSala:datosUsuario.salaUsuario,
        nombreUsuario:datosUsuario.nombreUsuario,
        resultadosUsuario:resultados
    }
    // console.log(datos);
    socket.emit("juego:recopilarResultados",datos);
}

function limpiarFormularioJuego(){
    let i=0;
    let input= document.getElementById("input-"+i);
    while(input!==null){
        input.value="";
        i++;
        input= document.getElementById("input-"+i);
    }
    if(chequearSiSoyAdmin()){
        btnEditarCategorias.classList.remove("oculto");
    }else{
        btnEditarCategorias.classList.add("oculto");
    }
}

function armarTablaDeResultados(listaResultados){
    //nombreSala//nombreUsuario//resultadosUsuario

    while(tablaResultados.firstChild){
        tablaResultados.removeChild(tablaResultados.firstChild);
    }
    
    let tabla=  `<caption>Resultados</caption>
                <tr>
                    <th>CATEGORIA</th>`;
                    listaResultados.forEach( (result)=>{
                        tabla+= `<th>${result.nombreUsuario}</th>`;
                    });
                tabla+=`</tr>`;
                for(let i=0;i<listaCategorias.length;i++){
                    tabla+=`<tr>`;
                    tabla+=`<th>${listaCategorias[i]}</th>`;

                    listaResultados.forEach( (result)=>{
                        tabla+=`<td>${result.resultadosUsuario[i]}</td>`;
                    })
                    tabla+=`</tr>`;
                }

                tabla+=`<tr>
                            <th>PUNTOS</th>`;
                            for(let i=0;i<listaResultados.length;i++){
                                tabla+=`<td>0</td>`;
                            }
                tabla+=`</tr>`;


    tablaResultados.innerHTML=tabla;
    return;
}


//ESCUCHAS DEL SOCKET
socket.on("juego:usuarioPreparado", (datos)=>{
    listaUsuariosMiSala.forEach( (usuario)=>{
        if(usuario.nombreUsuario==datos.nombre){
            usuario.preparadoUsuario=datos.preparado;
            cantUsuariosPreparados+= datos.preparado?1:-1;//si esta preparado los sumo sino lo resto
        }
    })

    // console.log(datos);
    console.log(cantUsuariosPreparados);
    console.log(cantConectadosEnMiSala);

    if(datos.preparado==false){//quiere decir que alguien aviso que no esta preparado
        detenerElJuego(datos.nombre);
        juegoLanzado=false;
        return;
    }
    if(cantUsuariosPreparados==cantConectadosEnMiSala){
        lanzarElJuego();
        juegoLanzado=true;
    }
})
socket.on("juego:yaIniciaron?", (respuesta)=>{
    juegoIniciado=respuesta;
})
socket.on("juego:necesitoTusResultados", (nombreBastardo)=>{
    recopilarEnviarMisResultados();
    finalizarYReiniciarElJuego();
    ocultarDivFormularioJuego();
    h2Letra.innerText=nombreBastardo+" dijo: Basta para todos, espere 3 segundos."
    setTimeout( ()=>{
        h2Letra.innerText=nombreBastardo+" dijo: Basta para todos.";
        socket.emit("juego:pedirResultadosSala",datosUsuario.salaUsuario);
    },3000);
})
socket.on("juego:volveAPedirResultados",(nada)=>{//se usa cuando el admin no acepta los resultados
    ocultarDivFormularioJuego();
    h2Letra.innerText="Volve a chequear tus Resultados.";
    socket.emit("juego:pedirResultadosSala",datosUsuario.salaUsuario);
})

socket.on("juego:recibiendoResultados", (listaResultados)=>{
    //armar la tabla con los resultados
    armarTablaDeResultados(listaResultados);
    mostrarDivResultados();
})

socket.on("juego:refrescarResultadosTabla",(info)=>{ //nombreUsuario //puntajesUsuario
    refrescarTablaResultados(info.nombreUsuario,info.puntajesUsuario);
})

socket.on("juego:ResultadosJugada", (listaResultadosMiSala)=>{//solo le llega al admin
    //nombreSala //nombreUsuario //resultadosUsuario  //puntajesUsuario (contiene el punto de cada celda)
    setTimeout(()=>{
        if(window.confirm("Usted es el Administrador, Desea confirmar los resultados recibidos?")){
            let listaDatos=new Array();
            let dato;
            let totalPuntaje=0;
            listaResultadosMiSala.forEach( (resultado)=>{
                resultado.puntajesUsuario.forEach( (puntos)=>{//sumo todos los puntos del usuario
                    totalPuntaje+=puntos;
                })
                dato={//preparo cada usuario y su puntaje
                    nombreUsuario:resultado.nombreUsuario,
                    puntajeUsuario:totalPuntaje
                }
                listaDatos.push(dato);
                totalPuntaje=0;
            })
            socket.emit("juego:guardarPuntajesJugada",listaDatos);//nombreUsuario //puntajeUsuario
            
        }else{
            //borra los puntajes para que los vuelvan a hacer y reenviar
            socket.emit("juego:resetearResultados",datosUsuario.salaUsuario)//nombreSala
            //hace que todos pidan otra ves el resultado de los demas y genera la tabla otra vez
            socket.emit("juego:adminNoAceptoResultados",listaUsuariosMiSala);
        }
    },1000);
})

socket.on("juego:llegoLetra",(letra)=>{
    console.log(letra);
    listaLetrasUsadas.push(letra);
    
    h2Letra.innerText='Letra: "'+letra+'"';
    if(listaLetrasUsadas.length==27){
        console.log("Se completo el abecedario, avisar a todos y reiniciar el array");
        console.log("Se completo el abecedario, avisar a todos y reiniciar el array");
        console.log("Se completo el abecedario, avisar a todos y reiniciar el array");
        console.log("Se completo el abecedario, avisar a todos y reiniciar el array");
        socket.emit("juego:reiniciarLetrasUsadas",listaUsuariosMiSala);
    }
});
socket.on("juego:reiniciarLetrasUsadas",(nada)=>{
    listaLetrasUsadas=new Array();
})

socket.on("categorias:recibirCategorias",(categorias)=>{
    listaCategorias=categorias;
    // console.log("Las categorias Son");
    // console.log(listaCategorias);
    crearLosLICategoria(listaCategorias);
    ocultarBotonesEdicion();
})



///DEBUGEANDO
socket.on("ver", (datos)=>{
    console.log(datos);
})

//SOCKET GENERAL
socket.on("todo:refrescarDatosPagina", (nulo)=>{
    socket.emit("pedirConectados");
    socket.emit("pedirSalas");
    socket.emit("actualizarMiSala",datosUsuario.salaUsuario);
    ocultarDivResultados();
    mostrarDivFormularioJuego();
    window.alert("pagina actualizada");
})

//EJECUCIONES INICIALES - LLAMADOS AUTOMATICOS
socket.emit("pedirConectados");
socket.emit("pedirSalas");
inputUsuario.focus();
ocultarUsuariosYSalas();
ocultarSalaSeleccionada();
ocultarDivResultados();

crearLosLICategoria(listaCategorias);
ocultarBotonesEdicion();