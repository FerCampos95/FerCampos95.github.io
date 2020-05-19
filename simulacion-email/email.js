var btnEnviar = document.getElementById("enviar");
var para =document.getElementById("para");
var asunto =document.getElementById("asunto");
var mensaje= document.getElementById("mensaje");
var spinner= document.getElementById("spinner");

btnEnviar.disabled= true;

para.addEventListener("keyup",verificarDatos);
asunto.addEventListener("keyup",verificarDatos);
mensaje.addEventListener("keyup",verificarDatos);
btnEnviar.addEventListener("click",enviarEmail);

function enviarEmail(e){
    e.preventDefault();
    spinner.hidden=false;
    setTimeout(function(){
        // spinner.src="img/msg-enviado.gif";
        spinner.src="img/msg-enviado.gif";

            setTimeout(function(){
                spinner.hidden=true;
            },3500);
    },3000);
    
}

function verificarDatos(){
    
    if(asunto.value ==="" || mensaje.value==="" || verificarEmail()==false){
        btnEnviar.disabled=true;
    }else{
        btnEnviar.disabled=false;
    }
}

function verificarEmail(){
    let email="";
    email=para.value.toString();
    email= email.split("");

    let arroba=false;
    let i=0
    for(i=0;i<email.length;i++){
        if(arroba==false){
            if(email[i]=="@"){
                arroba=true;
            }
        }
    }

    if(arroba==true && i>=2){
        return true;
    }
    return false;
}