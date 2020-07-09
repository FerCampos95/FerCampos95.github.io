// console.log("Servidor iniciado");
const path= require("path");
const express= require("express");
const SocketIO = require("socket.io");
const app =express();

//configuracion del puerto
app.set("port", process.env.PORT || 3000);

//direccion de donde leer los archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

//iniciando el servidor
const server =app.listen(app.get("port"), ()=>{
    console.log("Servidor iniciado en puerto: "+app.get("port"));
})

const io= SocketIO(server);

//variables de servidor
let listaConectados= new Array(); //nombreUsuario,idUsuario,nombreSala,puntaje
let listaSalas= new Array(); //nombreSala,adminSala,cantConectados,conectados
let listaResultadosSalas= new Array();//nombreSala //nombreUsuario //resultadosUsuario 
let listaCategoriasSala= new Array();//nombreSala //listaCategorias 

//conexiones del servidor
io.on("connection", (socket)=>{
    console.log("Se conecto: "+socket.id);

    ///FUNCIONES PARA USUARIOS
    socket.on("nuevoConectado", (usuario)=>{
        info={
            nombreUsuario: usuario,
            idUsuario: socket.id,
            nombreSala: "Ninguna-Sala",
            puntajeUsuario:0,
            preparadoUsuario:false,
            jugandoUsuario:false
        }
        listaConectados.push(info);
        io.emit("pedirConectados",listaConectados);
    })

    socket.on("pedirConectados",()=>{
        io.emit("pedirConectados",listaConectados);
    })

    socket.on("conectarseASala", (sala)=>{ 
        let usuario="";
        listaConectados.forEach( (u)=>{//al usuario le asigna una sala
            if(u.idUsuario== socket.id){
                u.nombreSala= sala;
                usuario=u.nombreUsuario;
            }
        })

        listaSalas.forEach( (s)=>{
            if(s.nombreSala== sala){
                s.conectados.push(usuario);
                s.cantConectados++;
            }
        })

        io.emit("pedirSalas",listaSalas);
        io.emit("pedirConectados",listaConectados);
    })
    
    socket.on("disconnect",()=>{
        let abandonador="nula";
        console.log("Se desconecto: "+socket.id);
        listaConectados.forEach( (usuario, index)=>{
            if(usuario.idUsuario == socket.id){
                if(usuario.nombreSala !== "Ninguna-Sala"){//es decir, el usuario estaba en una sala
                    quitarloDeSala(usuario.nombreUsuario,usuario.nombreSala); //lo quito de la sala
                    io.emit("actualizarMiSala",usuario.nombreSala);
                    abandonador=usuario.nombreUsuario;
                }
                listaConectados.splice(index,1);
            }
        })
        
        io.emit("pedirConectados",listaConectados);
        io.emit("pedirSalas",listaSalas);
        io.emit("elAbandonadorEs",abandonador);
        
    })

    ////FUNCIONES PARA SALAS
    socket.on("nuevaSala", (info)=>{
        datosSala={
            nombreSala: info.nombreSala,
            adminSala: info.adminSala,
            cantConectados: 0,
            conectados: new Array()
        }
        listaSalas.push(datosSala);
        io.emit("pedirSalas",listaSalas);
    })

    socket.on("pedirSalas", ()=>{
        io.emit("pedirSalas",listaSalas);
    })

    socket.on("salirDeSala", ()=>{
        let usuario="nulo";
        let sala="nulo";
        listaConectados.forEach( (u)=>{//recorro los usuarios
            if(u.idUsuario== socket.id){ //busco el que emitio el pedido
                sala=u.nombreSala;     //guardo la sala en la que esta
                u.nombreSala="Ninguna-Sala";//le quito la sala en la que esta
                u.puntajeUsuario=0;
                u.preparadoUsuario=false;
                u.jugandoUsuario=false;
                usuario=u.nombreUsuario; //guardo el nombre de usuario
            }
        })

        quitarloDeSala(usuario,sala);

        io.emit("pedirSalas",listaSalas);
        io.emit("pedirConectados",listaConectados);
    })

    socket.on("actualizarMiSala", (miSala)=>{
        io.emit("pedirSalas",listaSalas);
        io.emit("pedirConectados",listaConectados);
        io.emit("actualizarMiSala",miSala);
    })

    function quitarloDeSala(nombreUsuario, nombreSala){
        listaSalas.forEach( (sala,index)=>{ //busco la sala
            if(sala.nombreSala== nombreSala){ //la encuentro
                sala.cantConectados--; //quito 1 de la cantidad de conectados
                sala.conectados.forEach( (u,index)=>{ //reviso todos los conectados
                    if(u == nombreUsuario){ //lo encuentro
                        sala.conectados.splice(index,1); //lo quito
                    }else{//si no es le aviso que ya no esta(por si quieren jugar)
                        let info={
                            nombre:nombreUsuario,
                            preparado:true //para que finja que si esta ok
                        }
                        io.to(obtenerID(u)).emit("juego:usuarioPreparado", info);
                    }
                })

                if(sala.cantConectados==0){ //si la sala esta vacia
                    listaSalas.splice(index,1); //elimino esta sala
                }else{
                    sala.adminSala= sala.conectados[0]; //sino, pongo como admin al primero de la lista
                }
            }
        })
    }
    function obtenerID(nombre){
        let resultado= listaConectados.find(listaConectados => listaConectados.nombreUsuario==nombre);
        return resultado.idUsuario;
    }
    function obtenerNombre(id){ 
        let resultado= listaConectados.find(listaConectados => listaConectados.idUsuario==id);
        return resultado.nombreUsuario;
    }
    /////////FUNCIONES CATEGORIAS
    socket.on("categorias:cambioCategorias",(datos)=>{//nombreSala//listaReceptores //listaCategorias
        let sala= datos.nombreSala; //todos los usuario estan en la misma sala
        let salaGuardada=false;
        listaCategoriasSala.forEach((estaSala)=>{
            if(sala== estaSala.nombreSala){//si la sala ya esta la actualizo
                salaGuardada=true;
                estaSala.categorias=datos.listaCategorias;
            }
        })
        if(!salaGuardada){
            let info={
                nombreSala:sala,
                categorias:datos.listaCategorias
            }
            listaCategoriasSala.push(info);
        }

        let categoriasMiSala;
        listaCategoriasSala.forEach((estaSala)=>{
            if(estaSala.nombreSala== sala){
                categoriasMiSala=estaSala.categorias;
            }
        })
        
        datos.listaReceptores.forEach( (receptor)=>{
            io.to(receptor.idUsuario).emit("categorias:recibirCategorias",categoriasMiSala);
        })
    })
    socket.on("categorias:PedirCategorias",(sala)=>{
        let categoriasMiSala;
        listaCategoriasSala.forEach((estaSala)=>{
            if(estaSala.nombreSala== sala){
                categoriasMiSala=estaSala.categorias;
            }
        })
        io.to(socket.id).emit("categorias:recibirCategorias",categoriasMiSala);
    })
    
    ///////FUNCIONES PARA CHAT
    socket.on("enviarMensaje", (info)=>{ //datos es: listarecemptores,usuario,mensaje,hora
        info.listaReceptores.forEach( (receptor)=>{//recorro los receptores
            let datosMensaje={
                usuario:info.usuario,
                mensaje:info.mensaje,
                hora:info.hora
            }
            io.to(receptor.idUsuario).emit("recibirMensaje", datosMensaje);
        })
    })

    socket.on("escribiendo", (datos)=>{
        datos.listaReceptores.forEach( (receptor)=>{
            io.to(receptor.idUsuario).emit("escribiendo", datos.escritores);
        })
    })
    
    //FUNCIONES PARA EL JUEGO
    socket.on("juego:estoyListo",(datos)=>{//lista de receptores y nombre del preparado
        listaConectados.forEach( (usuario)=>{
            if(usuario.nombreUsuario== datos.nombrePreparado){
                usuario.preparadoUsuario=datos.preparado;
            }
        })
        let info={
            nombre:datos.nombrePreparado,
            preparado:datos.preparado
        }
        datos.listaReceptores.forEach( (receptor)=>{
            io.to(receptor.idUsuario).emit("juego:usuarioPreparado", info);
        })
    })
    socket.on("juego:iniciado", (datos)=>{//llega lista de receptores y true o false(juegan o no)
        datos.receptores.forEach( (jugador)=>{
            listaConectados.forEach( (usuario)=>{
                if(usuario.nombreUsuario==jugador.nombreUsuario){
                    usuario.jugandoUsuario=datos.jugando;//si llego true es xq juegan, sino false
                }
            })
        })
    })
    socket.on("juego:resetear",(listaReceptores)=>{
        listaReceptores.forEach( (jugador)=>{
            listaConectados.forEach( (usuario)=>{
                if(usuario.nombreUsuario==jugador.nombreUsuario){
                    usuario.jugandoUsuario=false;
                    usuario.preparadoUsuario=false;
                }
            })
        })
    })
    socket.on("juego:yaIniciaron?",(listaJugadores)=>{
        let respuesta=false;

        listaJugadores.forEach( (jugador)=>{
            listaConectados.forEach( (usuario)=>{
                if(usuario.nombreUsuario==jugador.nombreUsuario){
                    if(usuario.jugandoUsuario)
                        respuesta=true;
                }
            })
        })
        io.to(socket.id).emit("juego:yaIniciaron?", respuesta);
    })

    socket.on("juego:recopilarResultados", (datos)=>{//datos contiene =
        //nombreSala //nombreUsuario //resultadosUsuario  //y agrego puntajes (contiene el punto de cada celda)
        let info={
            nombreSala:datos.nombreSala,
            nombreUsuario:datos.nombreUsuario,
            resultadosUsuario:datos.resultadosUsuario,
            puntajesUsuario:null//lo cargo en otro socket
        }
        listaResultadosSalas.push(info);
    })
    socket.on("juego:aceptarResultados", (datos)=>{//nombreUsuario //nombreSala //puntajesUsuario
        let puntajesCompletos=true;
      
        listaResultadosSalas.forEach( (resultado)=>{
            if(resultado.nombreUsuario==datos.nombreUsuario){
                resultado.puntajesUsuario=datos.puntajesUsuario;
            }
            if(resultado.nombreSala==datos.nombreSala && resultado.puntajesUsuario==null){//quiere decir que alguien no mando su puntaje
                puntajesCompletos=false;
            }
        })
        if(puntajesCompletos){//entonces todos los usuario enviaron(de esta sala) enviaron su puntaje
            let resultadosEstaSala= new Array();
            listaResultadosSalas.forEach( (resultadosSala)=>{
                if(resultadosSala.nombreSala=datos.nombreSala)
                    resultadosEstaSala.push(resultadosSala);
            })

            listaSalas.forEach( (sala)=>{
                if(sala.nombreSala==datos.nombreSala){
                    //busco el admin y le aviso q estan todos los resultados
                    let id= obtenerID(sala.adminSala);
                    io.to(id).emit("juego:ResultadosJugada", resultadosEstaSala);
                }
            })
        }
    })
    socket.on("juego:resetearResultados", (nombreSala)=>{//nombreSala
        listaResultadosSalas.forEach( (resultado)=>{
            if(resultado.nombreSala==nombreSala){
                resultado.puntajesUsuario=null;
            }
        })
    })


    socket.on("juego:robarResultados", (listaVictimas)=>{
        listaVictimas.forEach( (victima)=>{
            io.to(victima.idUsuario).emit("juego:necesitoTusResultados",obtenerNombre(socket.id));
        })
    })

    socket.on("juego:adminNoAceptoResultados",(listaReceptores)=>{
        listaReceptores.forEach( (receptor)=>{
            io.to(receptor.idUsuario).emit("juego:volveAPedirResultados",null);
        })
    })
        
    socket.on("juego:pedirResultadosSala", (nombreSala)=>{
        let resultadosEstaSala= new Array();
        listaResultadosSalas.forEach((resultadosSala)=>{
            if(resultadosSala.nombreSala==nombreSala){
                resultadosEstaSala.push(resultadosSala);
            }
        })
        io.to(socket.id).emit("juego:recibiendoResultados",resultadosEstaSala);
    })
    
    socket.on("juego:refrescarResultadosTabla",(datos)=>{
        let info={
            nombreUsuario:datos.nombreUsuario,
            puntajesUsuario:datos.puntajesUsuario//tiene un array con el puntaje de cada categoria
        }
        datos.listaReceptores.forEach( (receptor)=>{
            io.to(receptor.idUsuario).emit("juego:refrescarResultadosTabla",info);
        })
    })
    
    socket.on("juego:resetearResultadosSala", (nombreSala)=>{//eliminos los resultados de mi sala
        listaResultadosSalas.forEach( (resultado,index)=>{//nombreSala //nombreUsuario //resultadosUsuario  
            if(resultado.nombreSala==nombreSala){
                listaResultadosSalas.splice(index,1);
            }
        })
    })

    socket.on("juego:guardarPuntajesJugada", (listaDatos)=>{//nombreUsuario //puntajeUsuario
        listaDatos.forEach( (dato)=>{
            listaConectados.forEach( (conectado)=>{
                if(conectado.nombreUsuario== dato.nombreUsuario){
                    conectado.puntajeUsuario+=dato.puntajeUsuario;
                }
            })
        })
        io.emit("todo:refrescarDatosPagina",null);
    });

    socket.on("juego:obtenerLetra",(datos)=>{//listaLetrasUsadas //listaReceptores
        let letras=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        let posicion;
        let letra;
        let repetida=false;
        // console.log("LETRAS USADAS:"+datos.listaLetrasUsadas);
        do{
            repetida=false;
            posicion= Math.floor(Math.random() * (26 - 0 + 1)) + 0;
            letra= letras[posicion];

            datos.listaLetrasUsadas.forEach( (l)=>{
                if(letra==l){
                    repetida=true;
                }
            })
            // console.log("INTENTO:"+letra);
        }while(repetida==true && datos.listaLetrasUsadas.length!==27);

        datos.listaReceptores.forEach( (receptor)=>{
            io.to(receptor.idUsuario).emit("juego:llegoLetra",letra);
        })
        // console.log("ENVIADA:"+letra);
    });
    
    socket.on("juego:reiniciarLetrasUsadas",(listaReceptores)=>{
        listaReceptores.forEach( (receptor)=>{
            io.to(receptor.idUsuario).emit("juego:reiniciarLetrasUsadas",null);
        })
    });

})