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


// console.log(typeof(variable));
// console.log(variable);
// console.log(typeof(linea));
// console.log(linea);

let lineaHora= "Holo";
iniciar(hora,lineaHora);

function iniciar(hora,lineaHora){
    //document.getElementById('reloj').innerHTML=`${hora.h}:${hora.m}:${hora.s}`;
    incrementarHora(hora);
    lineaHora = incrementarLineaHora(hora,lineaHora);
    
    document.getElementById('reloj').innerHTML=`${lineaHora}`;

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
    lineaHora="";
    
    if(hora.h.toString().length <2){
        lineaHora+= "0"+ hora.h;
    }else{
        if(hora.h ==0){ ///ESTO ES XQ SI EL NRO ES 0 NO LO PASA A STRING
            lineaHora+="00";
        }else{
            lineaHora+= + hora.h;
        }
    }

    lineaHora+=":";

    if(hora.m.toString().length <2){
        lineaHora+= "0"+ hora.m;
    }else{
        if(hora.m ==0){ ///ESTO ES XQ SI EL NRO ES 0 NO LO PASA A STRING
            lineaHora+="00";
        }else{
            lineaHora+= + hora.m;
        }
    }
    
    lineaHora+=":";

    if(hora.s.toString().length <2){
        lineaHora+= "0"+ hora.s;
    }else{
        if(hora.s ==0){ ///ESTO ES XQ SI EL NRO ES 0 NO LO PASA A STRING
            lineaHora+="00";
        }else{
            lineaHora+= + hora.s;
        }
    }

    return lineaHora;
}