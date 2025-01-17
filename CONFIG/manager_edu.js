function openweb() {
    location.href = "./CONFIG/dataescuela.html"
}
function openIni(email){
    byE("menu_general").hidden = false
    byE("btnRegistrarse").hidden = true
    console.clear()
}

let global_escuela={}

function open_escuela(){
    const escuela=GLOBAL.state.escuela
    let vigencias=[]
    for(id in escuela){
        if (escuela[id].id=="PROYECTO"){
            global_escuela["proyecto"]=escuela[id].nombre
            byE("Nombre_proyecto").textContent=escuela[id].nombre
        } else if(escuela[id].id.includes("V-")==true){
            vigencias.push(escuela[id])
            //console.log(escuela[id])

        } else if(escuela[id].id=="TABLAS"){
            global_escuela["tablas"]=escuela[id]
        }

    }
    global_escuela["vigencias"]=vigencias
    console.log(global_escuela)


    //console.log(GLOBAL.state.escuela)
}
