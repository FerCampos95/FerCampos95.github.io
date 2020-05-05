let html=""; //EL HTML Q ANDO AL HTML JAJA
let letra=""; //LETRA QUE AGARRO DEL INPUT
let fraseIngreso="";//STRING CON EL INGRESO DE LA FRASE
let frase=""; //ARRAY QUE QUEDA OCULTA LA FRASE CON "-"
let copia=""; //ARRAY CON LA FRASE SEPARADA LETRA X LETRA

let intentos=0; ///CANTIDAD DE INTENTOS FALLIDOS
let bandFallo=true; ///BANDERA PARA SABER SI ACERTO O FALLO
let letrasFallidas= new Array();//LETRAS QUE ERA INCORRECTAS
const LIMITEFALLOS=5;

desHabilitarBotones();


function pedirPalabra(){
    actualizarStatus();
    //PIDO LAS PALABRAS
    fraseIngreso=prompt("Ingrese la/s Palabra/s","Ingrese aqui");

    if(fraseIngreso===null || fraseIngreso.trim()==="")
    {
        return;
    }

    fraseIngreso= fraseIngreso.toUpperCase();
    
    //TRANSFORMO EN ARRAY y CREO UNA COPIA
    frase= fraseIngreso.split("");
    copia= fraseIngreso.split("");

    //RECORRO TODAS LA FRASE y LA OCULTO
    for(let i=0;i<frase.length;i++)
    {
        //COMPLETO CADA PALABRA CON "_" X LA CANTIDAD DE LETRAS
        if(frase[i]!=" "){
            frase[i]="-";
        }//CASO CONTRARIO SE QUEDA LO Q ESTABA(letra numero lo que fuere)
    }
    
    prepararEnviarHTML();

    habilitarBotones();
}

function prepararEnviarHTML(){
    html="";//FORMATO VISIBLE EN LA PAGINA (REINICIANDOLO)
    for(let i=0; i<frase.length;i++){
        html+= frase[i]+"";
    }
    document.getElementById('juego').innerHTML = `${html}`;
}

function chequearLetra(){
    
    letra=document.getElementById("ingLetra").value; //AGARRO EL INGRESO DEL INPUT

    if(letra===null || letra.trim()==="")//chequeo que la letra no sea nula o este vacia
    {
        console.log("debe ingresar una letra");
        return;
    }

    letra=letra.trim();//si colocaron un espacion lo quita
    letra=letra.substring(0,1); ///ME QUEDO SOLO CON LA PRIMERA
    letra= letra.toUpperCase(); ///LA PONGO EN MAYUSCULA

    bandFallo=true;

    for(let i=0;i<copia.length;i++){
        //ENCUENTRO LA LETRA EN LA FRASE
        if(letra== copia[i])
        {
            bandFallo=false;//INDICO QUE NO FALLO
            frase[i]=copia[i];
        }
       
    }
    if(bandFallo===true){
        intentos++;
        letrasFallidas.push(letra);
        letrasFallidas.sort(); ///oderno las fallidas
        bandFallo=false;///APAGO LA BANDERA PARA EL PROXIMO INTENTO

        actualizarStatus();
    }
    

    prepararEnviarHTML();    
    
    
    if(intentos===LIMITEFALLOS){
        mostrarPalabra();
        intentos=0;
        letrasFallidas= new Array(); //reinicio el array de letras
        desHabilitarBotones();
        fraseIngreso= fraseIngreso.normalize("NFC");//***  <--ESTO NO FUNCIONA  ***/////QUIERO NORMALIZARLO PARA QUE QDE MAS LINDO
        window.alert("Perdiste perro, era: "+ fraseIngreso);
    }

    //chequeo si gano
    if(frase.toString().localeCompare(copia.toString()) == 0)
    {
        window.alert("Felicitaciones,Ganaste.");
        desHabilitarBotones();
        intentos=0;
        letrasFallidas= new Array(); //reinicio el array de letras
        document.getElementById("letUsadas").innerHTML=(`Letras Usadas: ${letrasFallidas}`);
        document.getElementById("intentos").innerHTML=(`Intentos Restantes: ${LIMITEFALLOS-intentos}`);
   
    }

    document.getElementById("ingLetra").value="";
    document.getElementById("ingLetra").focus();
}

//////////////////////FUNCIONES PARA HABILITAR Y DESHABILITAR BOTONES
function habilitarBotones(){
    document.getElementById("ingLetra").hidden=false;
    document.getElementById("btnLetra").hidden=false;

    document.getElementById("btnCargar").hidden=true;
}

function desHabilitarBotones(){
    document.getElementById("ingLetra").hidden=true;
    document.getElementById("btnLetra").hidden=true;

    document.getElementById("btnCargar").hidden=false;
}

function mostrarPalabra(){
    html="";
    for(let i=0; i<frase.length;i++){
        html+= copia[i]+"";
    }
    document.getElementById('juego').innerHTML = `${html}`;
}

function actualizarStatus(){
    document.getElementById("letUsadas").innerHTML=(`Letras Usadas: ${letrasFallidas}`);
    document.getElementById("intentos").innerHTML=(`Intentos Restantes: ${LIMITEFALLOS-intentos}`);
        
    
    let ruta="";

    switch(intentos){
        case 0: ruta="imagenes/dib0.png";break;
        case 1: ruta="imagenes/dib1.png";break;
        case 2: ruta="imagenes/dib2.png";break;
        case 3: ruta="imagenes/dib3.png";break;
        case 4: ruta="imagenes/dib4.png";break;
        case 5: ruta="imagenes/dib6.png";break;
    }

    document.getElementById("imagen").src=(ruta);
}