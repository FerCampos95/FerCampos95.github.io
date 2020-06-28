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
let listaSalas= new Array(); //nombreSala,adminSalam,cantConectados,conectados

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
                sala.conectados.forEach( (u,index)=>{ //busco el conectado
                    if(u == nombreUsuario){ //lo encuentro
                        sala.conectados.splice(index,1); //lo quito
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
    
    
})

// io.emit("ver",datosMensaje); //este es para ver los datos desde la consola del navegador

