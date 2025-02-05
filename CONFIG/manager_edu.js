function openweb() {
    location.href = "./CONFIG/dataescuela.html"
}
function openIni(email) {
    byE("menu_general").hidden = false
    byE("btnRegistrarse").hidden = true
    console.clear()
}

let global_proyecto = {}

function open_escuela() {
    const proyecto = GLOBAL.state.proyectos
    let vigencias = []
    for (id in proyecto) {
        if (proyecto[id].id == "PROYECTO") {
            global_proyecto["proyecto"] = proyecto[id].nombre
            byE("Nombre_proyecto").textContent = proyecto[id].nombre
        } else if (proyecto[id].id.includes("V-") == true) {
            vigencias.push(proyecto[id])
            //console.log(escuela[id])
        } else if (proyecto[id].id == "TABLAS") {
            global_proyecto["TABLAS"] = proyecto[id]
        }

    }
    global_proyecto["vigencias"] = vigencias


    //Crear un selector de vigencias
    const panel_escritorio = byE("panel_escritorio")
    panel_escritorio.innerHTML = ""
    const hr = newE("hr", "hr_titulo", "")
    panel_escritorio.appendChild(hr)

    const row_tools = newE("div", "row_tools", "row align-items-center p-1 bg-secondary")
    panel_escritorio.appendChild(row_tools)

    const col_vigencia = newE("div", "col_vigencia", "col-md-4")
    row_tools.appendChild(col_vigencia)


    const sm_vigencia = newE("small", "sm_vigencia", "fw-bold text-white")
    sm_vigencia.textContent = "Vigencia"
    col_vigencia.appendChild(sm_vigencia)

    const sel_vigencia = newE("select", "sel_vigencia", "form-control mb-2")
    col_vigencia.appendChild(sel_vigencia)

    global_proyecto["vigencias"].forEach(vig => {
        const item = newE("option", "option" + vig.id)
        item.value = vig.id
        item.textContent = vig.id
        sel_vigencia.appendChild(item)
    });

    const row_tool_establecimiento = newE("div", "label_sedes", "row btn-label-escuela")
    panel_escritorio.appendChild(row_tool_establecimiento)

    const col_tit_establec= newE("div", "col_tit_sedes", "col-md-3 fw-bold")
    col_tit_establec.textContent = "Establecimientos"
    row_tool_establecimiento.appendChild(col_tit_establec)

    const col_add_establecimiento = newE("div", "col_add_establecimiento", "col-md-3 item-menu-escuela")
    col_add_establecimiento.textContent = "Agregar establecimiento +"
    row_tool_establecimiento.appendChild(col_add_establecimiento)

    const div_add_establecimiento = newE("div", "div_add_establecimiento", "border border-1 border-secondary mt-3 menu-group-scroll")
    panel_escritorio.appendChild(div_add_establecimiento)


    //Leo la tabla de establecimientos y verifico si hay o no datos

    if (typeof global_proyecto["TABLAS"]["ESTABLECIMIENTOS"] != "undefined") {

        _crear_establecimientos()
    } else {
        global_proyecto["TABLAS"] = {
            'ESTABLECIMIENTOS': []
        }
    }

    col_add_establecimiento.onclick = () => {
        const new_establecimiento = {
            'nombre': "Nuevo establecimiento",
            'director': "Nombre director/rector",
            'dane': 0,
            'sedes': []
        }
        global_proyecto["TABLAS"]["ESTABLECIMIENTOS"].push(new_establecimiento)
        Guardar_datos("TABLAS", global_proyecto["TABLAS"])
        _crear_establecimientos()

    }

    const div_add_sedes = newE("div", "div_add_sedes", "menu-group-scroll")
    panel_escritorio.appendChild(div_add_sedes)


    function _crear_establecimientos() {
        const data_establecimientos = global_proyecto["TABLAS"]["ESTABLECIMIENTOS"]
        div_add_establecimiento.innerHTML = ""
        for (id in data_establecimientos) {
            data_establecimientos[id]["id"] = id
            let i=id

            const btn_establecimiento = newE("div", "btn_establecimiento" + id, "row btn-label-white-long")
            btn_establecimiento.style.cursor = "pointer"

            btn_establecimiento.onclick=()=>{
                _crear_sedes(data_establecimientos[i].nombre)
            }


            const col_nombre = newE("div", "col_nombre" + id, "col-md-6")
            col_nombre.textContent=data_establecimientos[id].nombre
            btn_establecimiento.appendChild(col_nombre)

            const col_editar = newE("div", "col_editar" + id, "col-md-6 text-end")
            btn_establecimiento.appendChild(col_editar)

            const i_editar = newE("i", "i_editar" + id, "bi bi-pencil-square")
            i_editar.style.cursor = "pointer"
            i_editar.setAttribute("data-bs-toggle", "collapse");
            i_editar.setAttribute("data-bs-target", "#collapse_estab" + id);
            col_editar.appendChild(i_editar)

            div_add_establecimiento.appendChild(btn_establecimiento)

            const collapse_estable = newE("div", "collapse_estable" + id, "collapse p-2")
            collapse_estable.id = "collapse_estab" + id
            div_add_establecimiento.appendChild(collapse_estable)

            const div_estable = newE("div", "div_estable" + id, "card card-body")
            div_estable.style.background = "#f2f4f4"
            collapse_estable.appendChild(div_estable)

            const sm_nombre = newE("small", "sm_nombre" + id, "fw-bold")
            sm_nombre.textContent = "Nombre del establecimiento"
            div_estable.appendChild(sm_nombre)

            const int_nombre = newE("input", "int_nombre" + id, "form-control")
            int_nombre.type = "text"
            div_estable.appendChild(int_nombre)

            int_nombre.value = data_establecimientos[id].nombre

            int_nombre.onchange = () => {
                data_establecimientos[i].nombre = int_nombre.value
                col_nombre.textContent = int_nombre.value
                Guardar_datos("TABLAS", global_proyecto["TABLAS"])
            }

            const btn_delete = newE("button", "", "btn btn-secondary mt-2")
            btn_delete.type = "button"
            btn_delete.textContent = "Suprimir elemento"
            div_estable.appendChild(btn_delete)
            btn_delete.onclick = () => {
                const delete_i=delete_item(global_proyecto["TABLAS"]["ESTABLECIMIENTOS"],"id",i)
                global_proyecto["TABLAS"]["ESTABLECIMIENTOS"]=delete_i
                Guardar_datos("TABLAS", global_proyecto["TABLAS"])
                _crear_establecimientos()
            }
        }

    }
    function _crear_sedes(ESTABLECIMIENTO){
        div_add_sedes.innerHTML=""

        const row_tool_sedes = newE("div", "label_sedes", "row btn-label-escuela ms-1 me-1")
        div_add_sedes.appendChild(row_tool_sedes)
    
        const col_tit_sedes = newE("div", "col_tit_sedes", "col-md-3 fw-bold")
        col_tit_sedes.textContent = "Sedes - " + ESTABLECIMIENTO
        row_tool_sedes.appendChild(col_tit_sedes)
    }

}
function Guardar_datos(INDICE, DATA) {
    const data_base = GLOBAL.state.proyectos
    let indx = 0
    for (i in data_base) {
        if (data_base[i].id == INDICE) {
            indx = i
        }
    }
    GLOBAL.state.proyectos[indx] = DATA
    const id = GLOBAL.firestore.updateProyecto(GLOBAL.state.proyectos[indx])
}
function delete_item(DATA,CAMPO,ID) {
    const filter = DATA.filter(ele => ele[CAMPO] !== ID)
    return filter

}

