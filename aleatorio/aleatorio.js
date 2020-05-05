let html="";
let cant;

function crearNumeros(){
    cant= document.getElementById("cant").value;
    let decimales=10;


    if(cant == ""){
        decimales=100;
    }else{
        decimales= Math.pow(10,cant);
    }
    
    let num= Math.random() *decimales; //creo el numero aleatorio y le doy 2 digitos enteros
    num= Math.round(num); //redondeo los digitos enteros
    while(num < decimales/10){
        num= Math.random() *decimales; //creo el numero aleatorio y le doy 2 digitos enteros
        num= Math.round(num)-1; //redondeo los digitos enteros
        console.log("salio un numero menor era: "+num);
    }
    
    html+= num + "\n"; //lo agrego y coloco un salto de linea

    document.getElementById("seccion").innerHTML= `${html}`;
    
}

function resetear() {
    document.getElementById("seccion").innerText="";
    html="";
    
}