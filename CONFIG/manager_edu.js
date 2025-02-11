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


    /////////////////////////////////////////////////////////////////////////////
    /////////////////////MENU ESTABLECIMIENTO
    ////////////////////////////////////////////////////////////////////////////

    const col_menu_establecimiento = newE("div", "col_menu_establecimiento", "col-md-3")
    row_tool_establecimiento.appendChild(col_menu_establecimiento)

    const menu_establecimiento = newE("div", "menu_establecimiento", "dropdown")
    col_menu_establecimiento.appendChild(menu_establecimiento)

    const btn_establecimiento = newE("button", "btn_establecimiento", "btn-menu_escuela")
    btn_establecimiento.type = "button"
    btn_establecimiento.setAttribute("data-bs-toggle", "dropdown")
    btn_establecimiento.textContent = "Establecimientos"
    menu_establecimiento.appendChild(btn_establecimiento)

    const btn__add_establecimiento = newE("button", "btn__add_establecimiento", "btn-menu_escuela")
    btn__add_establecimiento.type = "button"
    btn__add_establecimiento.setAttribute("data-bs-toggle", "dropdown")

    const i__add_establecimiento = newE("i", "i__add_establecimiento", "bi bi-file-earmark-plus")
    btn__add_establecimiento.appendChild(i__add_establecimiento)



    menu_establecimiento.appendChild(btn__add_establecimiento)
    btn__add_establecimiento.onclick = () => {
        const new_establecimiento = {
            'nombre_corto': "Nombre corto",
            'nombre': "Nuevo establecimiento",
            'director': "Nombre director/rector",
            'dane': 0,
            'sedes': []
        }
        global_proyecto["TABLAS"]["ESTABLECIMIENTOS"].push(new_establecimiento)
        Guardar_datos("TABLAS", global_proyecto["TABLAS"])
        _crear_menu_establecimiento()
    }



    const ul_establecimientos = newE("ul", "ul_establecimientos", "dropdown-menu")
    ul_establecimientos.style.width = "300px"
    ul_establecimientos.onclick = (e) => {
        e.stopPropagation();
    }
    menu_establecimiento.appendChild(ul_establecimientos)

    /////////////////////////////////////////////////////////////////////////////


    const div_add_establecimiento = newE("div", "div_add_establecimiento", "border border-1 border-secondary mt-3 menu-group-scroll")
    panel_escritorio.appendChild(div_add_establecimiento)


    //Leo la tabla de establecimientos y verifico si hay o no datos

    if (typeof global_proyecto["TABLAS"]["ESTABLECIMIENTOS"] != "undefined") {
        _crear_menu_establecimiento()
    } else {
        global_proyecto["TABLAS"] = {
            'ESTABLECIMIENTOS': []
        }
        ul_establecimientos.textContent="Sin establecimientos"
    }


    const div_add_sedes = newE("div", "div_add_sedes", "menu-group-scroll")
    panel_escritorio.appendChild(div_add_sedes)


    function _crear_menu_establecimiento() {
        const data_establecimientos = global_proyecto["TABLAS"]["ESTABLECIMIENTOS"]
        ul_establecimientos.innerHTML = ""
        if(data_establecimientos.length==0){
            ul_establecimientos.textContent="|   Sin establecimientos"
        }
        for (id in data_establecimientos) {
            data_establecimientos[id]["id"] = id
            let i = id

            const btn_establecimiento = newE("div", "btn_establecimiento" + id, "row btn-label-white-long")
            btn_establecimiento.style.cursor = "pointer"

            btn_establecimiento.onclick = () => {
                _crear_sedes(data_establecimientos[i].nombre)
            }

            const col_editar = newE("div", "col_editar" + id, "col-auto")
            col_editar.style.width = "10px"
            btn_establecimiento.appendChild(col_editar)

            const col_nombre = newE("div", "col_nombre" + id, "col-auto")
            col_nombre.textContent = data_establecimientos[id].nombre_corto
            btn_establecimiento.appendChild(col_nombre)


            const i_editar = newE("i", "i_editar" + id, "bi bi-pencil-square")
            i_editar.style.cursor = "pointer"
            i_editar.setAttribute("data-bs-toggle", "collapse");
            i_editar.setAttribute("data-bs-target", "#collapse_estab" + id);
            col_editar.appendChild(i_editar)

            ul_establecimientos.appendChild(btn_establecimiento)

            const collapse_estable = newE("div", "collapse_estable" + id, "collapse p-2")
            collapse_estable.id = "collapse_estab" + id
            ul_establecimientos.appendChild(collapse_estable)

            const div_estable = newE("div", "div_estable" + id, "card card-body")
            div_estable.style.background = "#f2f4f4"
            collapse_estable.appendChild(div_estable)

            const sm_nombre = newE("small", "sm_nombre" + id, "fw-bold")
            sm_nombre.textContent = "Nombre corto"
            div_estable.appendChild(sm_nombre)

            const int_nombre = newE("input", "int_nombre" + id, "form-control")
            int_nombre.type = "text"
            div_estable.appendChild(int_nombre)

            int_nombre.value = data_establecimientos[id].nombre_corto

            int_nombre.onchange = () => {
                data_establecimientos[i].nombre_corto = int_nombre.value
                col_nombre.textContent = int_nombre.value
                Guardar_datos("TABLAS", global_proyecto["TABLAS"])
            }

            ////////////////////////////////////////
            const sm_nombre_largo = newE("small", "sm_nombre_largo" + id, "fw-bold")
            sm_nombre_largo.textContent = "Nombre del establecimiento"
            div_estable.appendChild(sm_nombre_largo)

            const int_nombre_largo = newE("textarea", "int_nombre_largo" + id, "form-control")
            int_nombre_largo.rows = 3
            int_nombre_largo.type = "text"
            div_estable.appendChild(int_nombre_largo)

            int_nombre_largo.value = data_establecimientos[id].nombre
            int_nombre_largo.onchange = () => {
                data_establecimientos[i].nombre = int_nombre_largo.value
                Guardar_datos("TABLAS", global_proyecto["TABLAS"])
            }

            ////////////////////////////////////////
            const sm_director = newE("small", "sm_director" + id, "fw-bold")
            sm_director.textContent = "Nombre del directivo"
            div_estable.appendChild(sm_director)

            const int_director = newE("input", "int_director" + id, "form-control")
            int_director.type = "text"
            div_estable.appendChild(int_director)

            int_director.value = data_establecimientos[id].director
            int_director.onchange = () => {
                data_establecimientos[i].director = int_director.value
                Guardar_datos("TABLAS", global_proyecto["TABLAS"])
            }

            ////////////////////////////////////////
            const sm_dane = newE("small", "sm_director" + id, "fw-bold")
            sm_dane.textContent = "Código DANE"
            div_estable.appendChild(sm_dane)

            const int_dane = newE("input", "int_dane" + id, "form-control")
            int_dane.type = "text"
            div_estable.appendChild(int_dane)

            int_dane.value = data_establecimientos[id].dane
            int_dane.onchange = () => {
                data_establecimientos[i].dane = int_dane.value
                Guardar_datos("TABLAS", global_proyecto["TABLAS"])
            }



            const btn_delete = newE("button", "", "btn btn-secondary mt-2")
            btn_delete.type = "button"
            btn_delete.textContent = "Suprimir elemento"
            div_estable.appendChild(btn_delete)
            btn_delete.onclick = () => {
                const delete_i = delete_item(global_proyecto["TABLAS"]["ESTABLECIMIENTOS"], "id", i)
                global_proyecto["TABLAS"]["ESTABLECIMIENTOS"] = delete_i
                Guardar_datos("TABLAS", global_proyecto["TABLAS"])
                _crear_menu_establecimiento()
            }
        }

    }



    function _crear_sedes(ESTABLECIMIENTO) {
        div_add_sedes.innerHTML = ""

        const row_tool_sedes = newE("div", "label_sedes", "row btn-label-escuela ms-1 me-1")
        div_add_sedes.appendChild(row_tool_sedes)

        const col_tit_sedes = newE("div", "col_tit_sedes", "col-md-4 fw-bold")
        col_tit_sedes.textContent = "Sedes - " + ESTABLECIMIENTO
        row_tool_sedes.appendChild(col_tit_sedes)

        const col_add_sedes = newE("div", "col_add_sedes", "col-md-3 item-menu-escuela")
        col_add_sedes.textContent = "Agregar sede +"
        row_tool_sedes.appendChild(col_add_sedes)


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
function delete_item(DATA, CAMPO, ID) {
    const filter = DATA.filter(ele => ele[CAMPO] !== ID)
    return filter

}

