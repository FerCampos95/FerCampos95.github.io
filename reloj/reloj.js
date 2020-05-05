//document.getElementById('reloj').innerHTML=`Esta es la hora :<br> `+ Date() ;
let hora = new Object();
// hora.h=0;
// hora.m=0;
// hora.s=0;

let variable =new String(Date());
// hora.h= variable.getHours;
// hora.m= variable.getMinutes;
// hora.s= variable.getSeconds;
let linea = "";
for(let i=16; i<=23;i++){
    linea= linea + variable[i];
}


let separados = linea.split(":");
hora.h=separados[0];
hora.m=separados[1];
hora.s=separados[2];


console.log(typeof(variable));
console.log(variable);
console.log(typeof(linea));
console.log(linea);

let lineaHora= "Holo";
iniciar(hora,lineaHora);

function iniciar(hora,lineaHora){
    document.getElementById('reloj').innerHTML=`${hora.h}:${hora.m}:${hora.s}`;
    //document.getElementById('reloj').innerHTML=`${lineaHora}`;
    incrementarHora(hora);
    //lineaHora = incrementarLineaHora(hora,lineaHora);
    
    setTimeout("iniciar(hora,lineaHora)",1000);
}

function incrementarHora(hora){
    hora.s++;
    if(hora.s===60){
        hora.s="00";
        hora.m++;

        if(hora.m===60){
            hora.m="00";
            hora.h++;

            if(hora.h===24){
                hora.h="00";
            }
        }
    }
    return hora;
}

function incrementarLineaHora(hora, lineaHora){
    if((hora.h.length) ===1){
        lineaHora= "0"+hora.h;
    }else{
        lineaHora= hora.h;
    }
    lineaHora+=":";

    if(hora.m.length <1){
        lineaHora+= "0"+hora.m;
    }else{
        lineaHora+= hora.m;
    }
    lineaHora+=":";

    if(hora.s.length <1){
        lineaHora+= lineaHora+ "0"+ hora.s;
    }else{
        lineaHora+= lineaHora + hora.s;
    }

}