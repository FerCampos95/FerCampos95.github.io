let tituloHoja;
let btnEditarHoja;
let btnAgregarHoja;
let btnBorrarHoja;
let selectHoja= document.getElementById("select"); //seleccionador de hoja para añadir nota
let checkboxHoja;
let listaHojas= document.getElementById("hojas"); //ul con los LI de nombres de Hojas

let textoNota;
let btnEditarNota;
let btnBorrarNota;
let btnAgregarNota;
let listaNotas;

let nuevoLI;
let nuevoCheckbox;
let nuevoLabel;
let nuevobtnEditar;
let nuevobtnBorrar;


eventListeners();

//EVENT LISTENERS
function eventListeners(){
    selectHoja.addEventListener("change",agregarHoja);
}

function agregarHoja(e){
    e.preventDefault();
    if(selectHoja.value==="nueva hoja"){
        tituloHoja= window.prompt("Ingrese el título de la nueva Hoja");
        
        if(tituloHoja !==null && tituloHoja.trim() !=="")
        {
            ///ACA METO EL CODIGO PARA AGREGAR UNA NUEVA CLAVE ->VALOR
            localStorage.setItem(tituloHoja,"");

            nuevoCheckbox= document.createElement("input");
            nuevoLabel= document.createElement("label");
            nuevobtnEditar= document.createElement("button");
            nuevobtnBorrar= document.createElement("button");
            
            nuevoCheckbox.className="lista-checkbox";
            nuevoCheckbox.type="checkbox";
            nuevoCheckbox.checked=true;

            nuevoLabel.className="lista-label";
            nuevoLabel.innerText= tituloHoja;

            nuevobtnEditar.className="lista-btn-editar";
            nuevobtnEditar.innerText="E";
            
            nuevobtnBorrar.className="lista-btn-borrar";
            nuevobtnBorrar.innerText="X";
            
            nuevoLI= document.createElement("li");
            nuevoLI.className="lista-hojas";
            nuevoLI.appendChild(nuevoCheckbox);
            nuevoLI.appendChild(nuevoLabel);
            nuevoLI.appendChild(nuevobtnEditar);
            nuevoLI.appendChild(nuevobtnBorrar);
            
            listaHojas.appendChild(nuevoLI);
        }


    }
}
//FIN DE EVENT LISTENERS

