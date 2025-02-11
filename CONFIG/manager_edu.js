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

    });

    for (ind in global_proyecto["vigencias"]) {
        const item = newE("option", "option" + ind)
        item.value = ind
        item.textContent = global_proyecto["vigencias"][ind].id
        sel_vigencia.appendChild(item)
    }

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



    const ul_establecimientos = newE("ul", "ul_establecimientos", "dropdown-menu shadow")
    ul_establecimientos.style.width = "300px"
    ul_establecimientos.onclick = (e) => {
        e.stopPropagation();
    }
    menu_establecimiento.appendChild(ul_establecimientos)





    //Leo la tabla de establecimientos y verifico si hay o no datos

    if (typeof global_proyecto["TABLAS"]["ESTABLECIMIENTOS"] != "undefined") {
        _crear_menu_establecimiento()
    } else {
        global_proyecto["TABLAS"] = {
            'ESTABLECIMIENTOS': []
        }
        ul_establecimientos.textContent = "Sin establecimientos"
    }

    //En esta sección agregaremos información del establecimiento y de la escuela

    const div_admin_sedes = newE("div", "div_admin_sedes", "")
    panel_escritorio.appendChild(div_admin_sedes)


    const row_info_sede = newE("div", "row_info_sede", "row mt-2")
    panel_escritorio.appendChild(row_info_sede)

    const col_nombre_establecimiento = newE("div", "col_nombre_establecimiento", "col-md-6")
    row_info_sede.appendChild(col_nombre_establecimiento)

    const col_nombre_sede = newE("div", "col_nombre_sedes", "col-md-6")
    col_nombre_sede.textContent = ""
    row_info_sede.appendChild(col_nombre_sede)

    const hr = newE("hr", "hr_titulo", "mt-2")
    panel_escritorio.appendChild(hr)
    ///////////////////////////////////////////////////////////////////////////////

    sel_vigencia.onchange = () => {
        byE("col_nombre_establecimiento").innerHTML = ""
        byE("col_nombre_sedes").innerHTML = ""
    }

    function _crear_menu_establecimiento() {
        const data_establecimientos = global_proyecto["TABLAS"]["ESTABLECIMIENTOS"]
        ul_establecimientos.innerHTML = ""
        if (data_establecimientos.length == 0) {
            ul_establecimientos.style.padding = "10px"
            ul_establecimientos.textContent = "| Sin establecimientos"
        }
        for (id in data_establecimientos) {
            data_establecimientos[id]["id"] = id

            let i = id
            const btn_establecimiento = newE("div", "btn_establecimiento" + id, "row btn-label-white-long")
            btn_establecimiento.style.cursor = "pointer"

            btn_establecimiento.onclick = () => {
                col_nombre_establecimiento.innerHTML = `
                <b>Establecimiento: </b> ${data_establecimientos[i].nombre_corto}
                `
                col_nombre_sede.innerHTML = ""
                _crear_menu_sedes(data_establecimientos[i])
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

    //Esta sección se encarga de estructurar las escuelas dentro de un centro o establecimiento
    //////////////////////////////////////////////////////////////////////////////7
    const col_menu_sedes = newE("div", "col_menu_establecimiento", "col-md-3")
    row_tool_establecimiento.appendChild(col_menu_sedes)
    function _crear_menu_sedes(data) {
        col_menu_sedes.innerHTML = ""

        const menu_sedes = newE("div", "menu_sedes", "dropdown")
        col_menu_sedes.appendChild(menu_sedes)

        const btn_sedes = newE("button", "btn_sedes", "btn-menu_escuela")
        btn_sedes.type = "button"
        btn_sedes.setAttribute("data-bs-toggle", "dropdown")
        btn_sedes.textContent = "Sedes"
        menu_sedes.appendChild(btn_sedes)


        const btn_add_sedes = newE("button", "btn_add_sedes", "btn-menu_escuela")
        btn_add_sedes.type = "button"
        btn_add_sedes.setAttribute("data-bs-toggle", "dropdown")


        const i_add_sedes = newE("i", "i_add_establecimiento", "bi bi-file-earmark-plus")
        btn_add_sedes.appendChild(i_add_sedes)

        btn_add_sedes.onclick = () => {
            const data_sedes = data.sedes
            const new_sede = {
                'nombre_corto': "Nombre corto",
                'nombre': "Nuevo establecimiento",
                'docente': "Nombre docente",
                'dane': 0,
            }
            data_sedes.push(new_sede)
            Guardar_datos("TABLAS", global_proyecto["TABLAS"])
            _crear_list_sedes()
        }

        menu_sedes.appendChild(btn_add_sedes)

        const ul_sedes = newE("ul", "ul_sedes", "dropdown-menu shadow")
        ul_sedes.style.width = "300px"
        ul_sedes.onclick = (e) => {
            e.stopPropagation();
        }
        menu_sedes.appendChild(ul_sedes)

        const data_sedes = data.sedes
        if (data_sedes.length == 0) {
            ul_sedes.style.padding = "10px"
            ul_sedes.textContent = "| Sin sedes"
        }
        _crear_list_sedes()
        function _crear_list_sedes() {
            ul_sedes.innerHTML = ""
            for (id in data_sedes) {
                data_sedes[id]["id"] = id

                let s = id
                const btn_sede = newE("div", "btn_sede_s" + id, "row btn-label-white-long")
                btn_sede.style.cursor = "pointer"

                btn_sede.onclick = () => {
                    col_nombre_sede.innerHTML = `
                    <b>Sede: </b> ${data_sedes[s].nombre_corto}
                    `
                    //Aquí conectamos con una de las tablas vigencia activa
                    //Debemos cargar los establecimientos y las sedes
                    administrar_vigencia(data.id,s)


                }
                const col_editar = newE("div", "col_editar_s" + id, "col-auto")
                col_editar.style.width = "10px"
                btn_sede.appendChild(col_editar)

                const col_nombre = newE("div", "col_nombre_s" + id, "col-auto")
                col_nombre.textContent = data_sedes[id].nombre_corto
                btn_sede.appendChild(col_nombre)


                const i_editar = newE("i", "i_editar_s" + id, "bi bi-pencil-square")
                i_editar.style.cursor = "pointer"
                i_editar.setAttribute("data-bs-toggle", "collapse");
                i_editar.setAttribute("data-bs-target", "#collapse_sede_s" + id);
                col_editar.appendChild(i_editar)

                ul_sedes.appendChild(btn_sede)

                const collapse_sede = newE("div", "collapse_sede_s" + id, "collapse p-2")
                collapse_sede.id = "collapse_sede_s" + id
                ul_sedes.appendChild(collapse_sede)

                const div_sede = newE("div", "div_sede_s" + id, "card card-body")
                div_sede.style.background = "#f2f4f4"
                collapse_sede.appendChild(div_sede)

                const sm_nombre = newE("small", "sm_nombre_s" + id, "fw-bold")
                sm_nombre.textContent = "Nombre corto"
                div_sede.appendChild(sm_nombre)

                const int_nombre = newE("input", "int_nombre_s" + id, "form-control")
                int_nombre.type = "text"
                div_sede.appendChild(int_nombre)

                int_nombre.value = data_sedes[id].nombre_corto

                int_nombre.onchange = () => {
                    data_sedes[s].nombre_corto = int_nombre.value
                    col_nombre.textContent = int_nombre.value
                    Guardar_datos("TABLAS", global_proyecto["TABLAS"])
                }

                ////////////////////////////////////////
                const sm_nombre_largo = newE("small", "sm_nombre_largo_s" + id, "fw-bold")
                sm_nombre_largo.textContent = "Nombre de la sedes"
                div_sede.appendChild(sm_nombre_largo)

                const int_nombre_largo = newE("textarea", "int_nombre_largo_s" + id, "form-control")
                int_nombre_largo.rows = 3
                int_nombre_largo.type = "text"
                div_sede.appendChild(int_nombre_largo)

                int_nombre_largo.value = data_sedes[id].nombre
                int_nombre_largo.onchange = () => {
                    data_sedes[s].nombre = int_nombre_largo.value
                    Guardar_datos("TABLAS", global_proyecto["TABLAS"])
                }

                ////////////////////////////////////////
                const sm_director = newE("small", "sm_director_s" + id, "fw-bold")
                sm_director.textContent = "Nombre del docente"
                div_sede.appendChild(sm_director)

                const int_director = newE("input", "int_director_s" + id, "form-control")
                int_director.type = "text"
                div_sede.appendChild(int_director)

                int_director.value = data_sedes[id].docente
                int_director.onchange = () => {
                    data_sedes[s].docente = int_director.value
                    Guardar_datos("TABLAS", global_proyecto["TABLAS"])
                }

                ////////////////////////////////////////
                const sm_dane = newE("small", "sm_dane_s" + id, "fw-bold")
                sm_dane.textContent = "Código DANE"
                div_sede.appendChild(sm_dane)

                const int_dane = newE("input", "int_dane_s" + id, "form-control")
                int_dane.type = "text"
                div_sede.appendChild(int_dane)

                int_dane.value = data_sedes[id].dane
                int_dane.onchange = () => {
                    data_sedes[s].dane = int_dane.value
                    Guardar_datos("TABLAS", global_proyecto["TABLAS"])
                }


                const btn_delete = newE("button", "btn_delete_s" + id, "btn btn-secondary mt-2")
                btn_delete.type = "button"
                btn_delete.textContent = "Suprimir elemento"
                div_sede.appendChild(btn_delete)
                btn_delete.onclick = () => {
                    let data_base = global_proyecto["TABLAS"]["ESTABLECIMIENTOS"][data.id]["sedes"]
                    let delete_s = delete_item(data_base, "id", s)
                    global_proyecto["TABLAS"]["ESTABLECIMIENTOS"][data.id]["sedes"] = delete_s
                    Guardar_datos("TABLAS", global_proyecto["TABLAS"])
                    _crear_menu_sedes(data)
                }
            }
        }
    }
}
function administrar_vigencia(id_establecimiento,id_sede) {
    const conf_tablas=global_proyecto["TABLAS"]

    if (typeof global_proyecto["vigencias"][sel_vigencia.value]["consolidados"] != "undefined") {
        const consolidados=global_proyecto["vigencias"][sel_vigencia.value]["consolidados"]

        console.log(consolidados[id_establecimiento]["sedes"][id_sede])
        
    } else {
        global_proyecto["vigencias"][sel_vigencia.value]["consolidados"]=global_proyecto["TABLAS"]["ESTABLECIMIENTOS"]
        const id_vigencia=global_proyecto["vigencias"][sel_vigencia.value].id
        Guardar_datos(id_vigencia, global_proyecto["vigencias"][sel_vigencia.value])
    }


    //console.log(global_proyecto["vigencias"][sel_vigencia.value])


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

