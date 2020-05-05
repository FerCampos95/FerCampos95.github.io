
function agarrarDatos() {
    let texto = document.getElementById('entrada').value;
    document.getElementById('texto').innerHTML=(`${texto}`);
    
    window.alert("Usted ingreso: "+texto);
}