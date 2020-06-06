let origen = document.getElementById("origen");
let cantNombres= document.getElementById("cantNombres");
let apellido= document.getElementById("apellido");
let genero= document.getElementsByName("genero");

let btnGenerar= document.getElementById("btnGenerar");

let nombresGenerados="";

btnGenerar.addEventListener("click",generarNombres);

function generarNombres(e){
    let labelGenerados= document.getElementById("generados");
    let gen;
    genero.forEach(function(sexo){
        if(sexo.checked){
            gen=sexo;
        }
    })
    

    if(gen === undefined){
        labelGenerados.style="color: red";
        labelGenerados.innerText="Debe seleccionar un Género";
        return;
    }
    if(origen.value==="seleccione"){
        labelGenerados.style="color: red";
        labelGenerados.innerText="Debe seleccionar un origen";
        return;
    }
    if(cantNombres.value<1){
        labelGenerados.style="color: red";
        labelGenerados.innerText="El valor de la cantidad de nombres debe ser mayor que 0";
        return;
    }
    
    
    // console.log("Origen:"+origen.value);
    // console.log("Cant nombres:"+cantNombres.value);
    // console.log("apellido:"+apellido.value);
    // console.log("genero:"+gen.value);

    
    leerNombres(origen.value,cantNombres.value,gen.value); //me lo guarda en nombres generados xq no se como retornarlo por una variable
    
    labelGenerados.innerText=""; 
    document.getElementById("loader").hidden=false;

    setTimeout(function(){
        document.getElementById("loader").hidden=true;
        nombresGenerados+=apellido.value;
        labelGenerados.innerText=nombresGenerados;
    },500)
}




/////////////////////////////////////////FUNCIONES DE CONSULTAS////////////////////////
function leerNombres(origen,cantidad,genero){
    const xhttp= new XMLHttpRequest();
    xhttp.open("GET","res/names.json",true);
    xhttp.send();
    xhttp.onreadystatechange= function(){
        
        if(this.readyState == 4 && this.status ==200){

            let respuesta = JSON.parse(this.responseText);
            let nombres="";
            
            let resultado= new Array;
            respuesta.forEach(elem => { //con esto obtengo el array de esa region
                if(elem.region==origen){
                    resultado= elem; ///conservo esta parte del array
                }
            });
            
            if(genero==="male")
            resultado= resultado.male;
            else//si no selecciono nada da nombres de mujeres
            resultado= resultado.female;
            
            let cantNombres= resultado.length-1; //agarro la cantidad de nombres para que el aleatorio no sea mas grande
            
            
            for(let i=0;i<cantidad;i++){
                aleatorio= obtenerAleatorio(cantNombres);
                nombres+= resultado[aleatorio]+" ";
                
                // console.clear();
                // console.log("Tope Nombres: "+ cantNombres);
                // console.log("Aleatorio: "+ aleatorio);
                // console.log(resultado);
            }
            
            // console.log(nombres);
            nombresGenerados=nombres;
            return nombres;
        }
    }
}
    
function obtenerAleatorio(tope){ //obtengo un numero entre el 0 y el tope
    let cantDecimales= contarDecimales(tope);
    decimales= Math.pow(10,cantDecimales);

    let num= Math.random() *decimales; //creo el numero aleatorio y le doy 2 digitos enteros
    num= Math.round(num); //redondeo los digitos enteros
    while(num>tope){
        num= Math.random() *decimales; //creo el numero aleatorio y le doy 2 digitos enteros
        num= Math.round(num); //redondeo los digitos enteros
        // console.log("salio un numero menor era: "+num);
    }

    return num;
}
function contarDecimales(numero){
    let decimales=1;

    while(numero>=10){
        numero=numero/10;
        decimales++;
        numero=Math.round(numero);
        // console.log(numero);
    }

    // console.log("decimales: "+decimales);
    return decimales;
}