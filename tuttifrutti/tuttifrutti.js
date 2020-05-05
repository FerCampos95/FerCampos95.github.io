/*
puedo crear un txt para ver el estado del juego y 
que diga el jugador uno ya esta preparado
que se valla actualizando todo el tiempo
(tambien lo puedo usar para comenzar y finalizar el juego, lo puedo poner en un div
invisible)
*/

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

var docTxt= crearObjetoAjax(); //GENERO LA VARIABLE PARA MI ARCHIVO
docTxt.open("GET","res/jug1.txt",true); //ABRE EL ARCHIVO, TRUE PARA ASINCRONO
docTxt.onreadystatechange= leerArchivo;///FUNCION SIN () PARA QUE NO ESPERE VALOR DE RETORNO
docTxt.send(); //SIN PARAMETROS XQ ES "GET"

var texto;

function leerArchivo(){
    //readyState == 4 comprueba la pagina cargada correctamente
    //status == 200 comprobamos q encontro la url de la pag
    if( docTxt.readyState == 4 && docTxt.status == 200){
        texto= docTxt.responseText;
    }
}

function verTexto(){
    document.getElementById("texto").innerText=texto;
}

function ocultarTexto(){
    document.getElementById("texto").innerText="";
}