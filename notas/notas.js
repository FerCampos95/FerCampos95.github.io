//VARIABLES
let texto="";
let listaNotas= document.getElementById("listaNotas");

//EVENT LISTENERS
eventListeners();

function eventListeners(){
    //CUANDO APRETO SUBMIT
    document.getElementById("formulario").addEventListener("submit",agregarNota);
    listaNotas.addEventListener("click",borrarNota);
    document.addEventListener("DOMContentLoaded", cargarNotas);
}

//FUNCIONES
function agregarNota(e){
    e.preventDefault(); //EVITA QUE SE ABRA EL ACTION DEL FORMULARIO
    
    texto= document.getElementById("nota").value;

    console.log(texto);
    // // let lista = document.getElementById("lista").innerHTML;
    // // document.getElementById("lista").innerHTML=`${lista}<li>${texto} <button>x</button> </li>`;

    let li= document.createElement("li"); 
    li.innerText= texto;
    
    let btnBorrar= document.createElement("button");
    btnBorrar.classList="btn-borrar"; //aca añado una clase al boton
    btnBorrar.innerText="X";

    li.appendChild(btnBorrar); ///AGREGO EL BOTON AL LI
    listaNotas.appendChild(li); ///AGREGO EL LI A LA LISTA DE NOTAS (ul -> en html)


    insertarEnLocalStorage(texto);
}

function borrarNota(e){
    e.preventDefault();

    if(e.target.className== "btn-borrar")
    {
        listaNotas.removeChild(e.target.parentElement);
        console.log(e.target.parentElement);

        
        quitarDeLocalStorage(e.target.parentElement.innerText); //mando el contenido del li
    }
}

function insertarEnLocalStorage(texto){
    let notas;
    notas =agarrarNotasdeLocalStorage();
    notas.push(texto);

    localStorage.setItem("notas",JSON.stringify(notas) );
}

function agarrarNotasdeLocalStorage(){
    let notas;
    if(localStorage.getItem("notas") === null){
        notas= [];
    }else{
        notas= JSON.parse(localStorage.getItem("notas") );
    }

    return notas; //TENGA O NO TENGA NADA RETORNA UN ARRAY
}

function cargarNotas(){
    let notas = new Array();

    notas= agarrarNotasdeLocalStorage();
    
    notas.forEach( function(nota) {
        let li= document.createElement("li"); 
        li.innerText= nota;
        
        let btnBorrar= document.createElement("button");
        btnBorrar.classList="btn-borrar" //aca podria añadirle una clase al boton
        btnBorrar.innerText="X";

        li.appendChild(btnBorrar); ///AGREGO EL BOTON AL LI
        listaNotas.appendChild(li); ///AGREGO EL LI A LA LISTA DE NOTAS (ul -> en html)

    });
}


function quitarDeLocalStorage(contenido){
    let posicion=0;
    let notas =new Array();
    notas= agarrarNotasdeLocalStorage();


    contenido= contenido.substring(0,contenido.length-1);
    console.log(contenido);

    posicion= notas.indexOf(contenido);
    notas.splice(posicion,1);    

    localStorage.setItem("notas",JSON.stringify(notas) );
}


