function openweb() {
    location.href = "./CONFIG/dataescuela.html"
}
function openIni(email){
    byE("menu_general").hidden = false
    byE("btnRegistrarse").hidden = true
    console.clear()
}
function open_escuela(){
    const escuela=GLOBAL.state.escuela
    for(id in escuela){
        if (escuela[id].id=="PROYECTO"){
            console.log(escuela[id].nombre)
                byE("Nombre_proyecto").textContent=escuela[id].nombre
        }
    }



    //console.log(GLOBAL.state.escuela)
}
