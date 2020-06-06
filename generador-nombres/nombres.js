// import leerNombres from './consultas';

let origen = document.getElementById("origen");
let cantNombres= document.getElementById("cantNombres");
let apellido= document.getElementById("apellido");
let genero= document.getElementsByName("genero");

let btnGenerar= document.getElementById("btnGenerar");

btnGenerar.addEventListener("click",generarNombres);

function generarNombres(e){
    let gen;

    genero.forEach(function(sexo){
        if(sexo.checked){
            gen=sexo;
        }
    })

    if(gen === undefined){
        return;
    }

    // console.log("Origen:"+origen.value);
    // console.log("Cant nombres:"+cantNombres.value);
    // console.log("apellido:"+apellido.value);
    // console.log("genero:"+gen.value);

    let labelGenerados= document.getElementById("generados");
    let respuesta= leerNombres(origen.value,cantNombres.value,gen.value);
    console.log(respuesta);
    // respuesta+=apellido;
    labelGenerados.innerText=respuesta;
}




/////////////////////////////////////////FUNCIONES DE CONSULTAS////////////////////////
function leerNombres(origen,cantidad,genero){
    // respuesta=new Array();
    let nombres="";
    // origen="Colombia";
    // cantidad=2;

    fetch("res/names.json")
        .then(respuesta => respuesta.json()) ///formato en el que obtengo
        // .then(respuesta => console.log(respuesta)) ///muestro lo que obtuve
        .then(respuesta => {
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
                
            }
            
            // document.getElementById("generados").innerText=nombres;
            
        })
        .catch(error => console.log("Hubo un error en la lectura: "+error.message))

        console.log(nombres);
        return nombres;
}

function obtenerAleatorio(tope){ //obtengo un numero entre el 0 y el tope
    let cantDecimales= contarDecimales(tope);
    decimales= Math.pow(10,cantDecimales);

    let num= Math.random() *decimales; //creo el numero aleatorio y le doy 2 digitos enteros
    num= Math.round(num); //redondeo los digitos enteros
    while(num>tope){
        num= Math.random() *decimales; //creo el numero aleatorio y le doy 2 digitos enteros
        num= Math.round(num)-1; //redondeo los digitos enteros
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