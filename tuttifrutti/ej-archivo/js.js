let entrada= document.getElementById("entrada").value;


function guardarUsuario(){
    sessionStorage.setItem("usuario",entrada);
}

function mostrarUsuario(){
    entrada= sessionStorage.getItem("usuario");
    document.getElementById("texto").innerText=entrada;
}