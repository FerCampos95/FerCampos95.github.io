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
    if(usuario.length > 15 || usuario=="" || usuario==null || usuario==undefined || usuario.trim()==""){
        requisitosUsuario.innerText="Error, el nombre de usuario debe tener entre 1 y 15 Caracteres";
        inputUsuario.style.color="red";
        return false;
    }else{
        requisitosUsuario.innerText="Ingrese su nombre de Usuario (1-15 Caracteres)";
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
    listaUsuarios.forEach( (u)=>{
        if(u.nombreSala== datosUsuario.salaUsuario){  //si uno de esos esta en mi sala
            listaUsuariosMiSala.push(u); //lo agrego en la lista de mi sala
        }
        
        let liConectado= document.createElement("li");
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
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////SALAS////////////////////////////////////////////////
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
        divSalaSeleccionada.style.display="flex";
        
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

function cargarDatosDeLaSala(nombreDeSala){
    // tituloDeSala.innerText="Conectado a: "+nombreDeSala;
    // //listaUsuariosMiSala  -> esta variable la cargo con los usuarios q estan en mi sala al traer a los conectados
    // let datosSala= listaSalas.find(listaSalas => listaSalas.nombreSala== nombreDeSala)//busco los datos de esta sala para obtener el admin
    // let adminSala= datosSala.adminSala;

    // let ulConectadosSala= document.getElementById("ul-conectados-sala");
    // while(ulConectadosSala.firstChild){
    //     ulConectadosSala.removeChild(ulConectadosSala.firstChild);
    // }

    // listaUsuariosMiSala.forEach( (u)=>{

    //     let liConectadoSala= document.createElement("li");
    //     liConectadoSala.id="li-conectados-sala";

    //     let pNombre= document.createElement("p");
    //     pNombre.innerText=u.nombreUsuario;
    //     if(u.nombreUsuario==adminSala){
    //         pNombre.innerText+=" (ADMIN)";
    //     }

    //     let pPuntaje = document.createElement("p");
    //     pPuntaje.innerText=u.puntajeUsuario;

    //     liConectadoSala.appendChild(pNombre);
    //     liConectadoSala.appendChild(pPuntaje);

    //     ulConectadosSala.appendChild(liConectadoSala);
    // })

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

            listaUsuariosMiSala.forEach( (u)=>{

                let liConectadoSala= document.createElement("li");
                liConectadoSala.id="li-conectados-sala";

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
})




///DEBUGEANDO
socket.on("ver", (datos)=>{
    console.log(datos);
})


//EJECUCIONES INICIALES - LLAMADOS AUTOMATICOS
socket.emit("pedirConectados");
socket.emit("pedirSalas");
ocultarUsuariosYSalas();
ocultarSalaSeleccionada();