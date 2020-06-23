const socket= io();
const TIMEOUTESPERA=1000;

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

                let pPuntaje = document.createElement("p");
                pPuntaje.innerText=u.puntajeUsuario;

                liConectadoSala.appendChild(pNombre);
                liConectadoSala.appendChild(pPuntaje);

                ulConectadosSala.appendChild(liConectadoSala);

            })
        },TIMEOUTESPERA);
    })

    let contador=0;
    socket.on("elAbandonadorEs", (escrache)=>{
        abandonador=escrache;
    })
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


///DEBUGEANDO
socket.on("ver", (datos)=>{
    console.log(datos);
})


//EJECUCIONES INICIALES - LLAMADOS AUTOMATICOS
socket.emit("pedirConectados");
socket.emit("pedirSalas");
inputUsuario.focus();
ocultarUsuariosYSalas();
ocultarSalaSeleccionada();