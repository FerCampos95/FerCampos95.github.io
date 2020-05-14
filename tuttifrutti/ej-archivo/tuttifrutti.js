
//PROBAR USAR SOLO 1 OBJETO AJAX Y SOLO EL METODO POST

/*
puedo crear un txt para ver el estado del juego y 
que diga el jugador uno ya esta preparado
que se valla actualizando todo el tiempo
(tambien lo puedo usar para comenzar y finalizar el juego, lo puedo poner en un div
invisible)


*AL FINALIZAR INTENTAR AGREGAR UNA COMUNICACION POR AUDIO ENTRE LAS PERSONAS*
*/

///Esta Funcion crea un objeto que me permite interactuar desde la pagina
function crearObjetoAjax(){
    var obj;
    
    if(window.XMLHttpRequest){ ///PREGUNTA SI PUEDE CREAR EL OBJETO
        obj= new XMLHttpRequest(); ///LO CREA Y LO ASIGNA
    }
    else{
        obj= new ActiveXObject(Microsoft.XMLHTTP); /// SINO LO PUEDE CREAR (es para explorer)
    }
    
    return obj;
}

var docTxt= crearObjetoAjax(); //GENERO LA VARIABLE PARA MI TXT
docTxt.open("GET","res/jug1.txt",true); //ABRE EL ARCHIVO, TRUE PARA ASINCRONO
docTxt.onreadystatechange= leerArchivo;///FUNCION SIN "()" PARA QUE NO ESPERE VALOR DE RETORNO
docTxt.send(); //SIN PARAMETROS XQ ES "GET"

var texto;

function leerArchivo(){
    //readyState == 4 comprueba la pagina cargada correctamente
    //status == 200 comprobamos q encontro la url de la pag
    if( docTxt.readyState == 4 && docTxt.status == 200){
        texto= docTxt.responseText;
        //document.getElementById("texto").innerText=texto;
        verTexto();
    }
}

function verTexto(){
    document.getElementById("texto").innerText=texto;
}



////////////////////////////////////grabo archivo
//let texto;

//doc2Txt.onreadystatechange= grabarArchivo();
var doc2Txt= crearObjetoAjax(); //GENERO LA VARIABLE PARA MI ARCHIVO


function grabarArchivo(){
    texto= document.getElementById("entrada").value;
    
    doc2Txt.open("POST","res/jug2.txt",true); //ABRE EL ARCHIVO, TRUE PARA ASINCRONO

    doc2Txt.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //doc2Txt.setRequestHeader("Content-Length", doc2Txt.length);
    // doc2Txt.setRequestHeader("Connection", "close");
    //doc2Txt.overrideMimeType('text/plain; charset=x-user-defined');
   
   
    //STATE 0 SIN INICIALIZAR- 1 INICIALIZADO - 2 CABECERASRECIBIDAS -3 CARGARNDO -4 COMPLETADO
    console.log(doc2Txt.readyState); //responde 1

    console.log(doc2Txt.status);     //responde 0
    
    console.log("intentando enviar");
    doc2Txt.send(texto);
}