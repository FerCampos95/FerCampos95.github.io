// console.log("Servidor iniciado");
const path= require("path");
const express= require("express");
const SocketIO = require("socket.io");
const { Socket } = require("dgram");
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
let listaConectados= new Array();
let listaSalas= new Array(); 

//conexiones del servidor
io.on("connection", (socket)=>{
    console.log("Se conecto: "+socket.id);

    ///FUNCIONES PARA USUARIOS
    socket.on("nuevoConectado", (usuario)=>{
        info={
            nombreUsuario: usuario,
            idUsuario: socket.id,
            nombreSala: "Ninguna-Sala"
        }
        listaConectados.push(info);
        io.emit("pedirConectados",listaConectados);
    })

    socket.on("pedirConectados",()=>{
        io.emit("pedirConectados",listaConectados);
    })

    socket.on("conectarseASala", (sala)=>{
        listaConectados.forEach( (u)=>{
            if(u.idUsuario== socket.id){
                u.nombreSala= sala;
            }
        })
        io.emit("pedirConectados",listaConectados);
    })

    socket.on("disconnect",()=>{
        console.log("Se desconecto: "+socket.id);
        listaConectados.forEach( (usuario, index)=>{
            if(usuario.idUsuario == socket.id){
                if(usuario.nombreSala !== "Ninguna-Sala"){//es decir, el usuario estaba en una sala
                    quitarloDeSala(usuario.nombreUsuario,usuario.nombreSala); //lo quito de la sala
                }
                listaConectados.splice(index,1);
            }
        })

        io.emit("pedirConectados",listaConectados);
        io.emit("pedirSalas",listaSalas);
    })

    ////FUNCIONES PARA SALAS
    socket.on("nuevaSala", (info)=>{
        datosSala={
            nombreSala: info.nombreSala,
            adminSala: info.adminSala,
            cantConectados: 1,
            conectados: new Array()
        }
        datosSala.conectados.push(info.adminSala);
        listaSalas.push(datosSala);
        io.emit("pedirSalas",listaSalas);
    })

    socket.on("pedirSalas", ()=>{
        io.emit("pedirSalas",listaSalas);
    })

    function quitarloDeSala(nombreUsuario, nombreSala){
        listaSalas.forEach( (sala,index)=>{ //busco la sala
            if(sala.nombreSala== nombreSala){ //la encuentro
                sala.cantConectados--; //quito 1 de la cantidad de conectados
                sala.conectados.forEach( (u,index)=>{ //busco el conectado
                    if(u.nombreUsuario == nombreUsuario){ //lo encuentro
                        sala.conectados.splice(index,1); //lo quito
                    }
                })

                if(sala.cantConectados==0){ //si la sala esta vacia
                    listaSalas.splice(index,1); //elimino esta sala
                }else{
                    sala.adminSala= sala.conectados[0].nombreUsuario; //sino, pongo como admin al primero de la lista
                }
            }
        })
    }
})