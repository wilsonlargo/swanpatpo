function openweb() {
    location.href = "./CONFIG/dataescuela.html"
}
function openIni(email) {
    byE("menu_general").hidden = false
    byE("btnRegistrarse").hidden = true
    console.clear()
}
const lista_campos_estudiante = [
    ['grado_cod', "GRADO", true, true],
    ['nivel', "NIVEL", true, false],
    ['nombres', "NOMBRES", true, false],
    ['apellidos', "APELLIDOS", true, false],
    ['documento', "DOCUMENTO", true, true],
    ['tipo_documento', "TIPO DOCUMENTO", true, false],
    ['genero', "GENERO", true, true],
    ['fnacimiento', "FECHA NACIMIENTO", true, true],
]


//Almacena la base de datos completa del proyecto seleccionado
let global_proyecto = {}

let filtro_tabla = {
    "clase": "",
    "campo": "",
    "valores": []
}

//Variable que guarda temporalmente la base de datos estudiantes con o sin filtro
let data_temp;

function open_escuela() {
    //Carga todos los proyectos en la base de datos firebase
    const proyecto = GLOBAL.state.proyectos
    //Variable guarda todas la tablas relacionadas con vigencias
    let vigencias = []
    for (id in proyecto) {
        if (proyecto[id].id == "PROYECTO") { //Si el la tabla es proyecto, guarda la información propoa del proyecto
            global_proyecto["proyecto"] = proyecto[id].nombre
            byE("Nombre_proyecto").textContent = proyecto[id].nombre
        } else if (proyecto[id].id.includes("V-") == true) {//Si es una vigencia, guardar las vigencias pertenecientes a un proyecto
            vigencias.push(proyecto[id])
        } else if (proyecto[id].id == "TABLAS") {//Guardar todas las tablas del proyecto
            global_proyecto["TABLAS"] = proyecto[id]
        }

    }
    //Actualiza todas la vigencias de un proyecto educatvio
    global_proyecto["vigencias"] = vigencias


    //Crear un selector de vigencias
    const panel_escritorio = byE("panel_escritorio")
    panel_escritorio.innerHTML = ""

    const row_tools = newE("div", "row_tools", "row align-items-center p-1 bg-secondary")
    panel_escritorio.appendChild(row_tools)

    const col_vigencia = newE("div", "col_vigencia", "col-md-6")
    row_tools.appendChild(col_vigencia)

    const col_menu_config = newE("div", "col_vigencia", "col-md-6 text-end")
    row_tools.appendChild(col_menu_config)

    const menu_config = newE("div", "menu_config", "nav-item dropdown")
    col_menu_config.appendChild(menu_config)

    const a_menu_config = newE("a", "a_menu_config", "nav-link dropdown-toggle text-white")
    a_menu_config.textContent = "Herramientas"
    a_menu_config.href = "#"
    a_menu_config.setAttribute("data-bs-toggle", "dropdown")
    menu_config.appendChild(a_menu_config)

    const ul_menu_config = newE("div", "ul_menu_config", "dropdown-menu shadow")
    menu_config.appendChild(ul_menu_config)

    const li_menu_importar = newE("li", "li_menu_importar", "")
    ul_menu_config.appendChild(li_menu_importar)

    const a_menu_importar = newE("a", "a_menu_importar", "dropdown-item")
    a_menu_importar.textContent = "Importar establecimientos"
    a_menu_importar.href = "#"
    li_menu_importar.appendChild(a_menu_importar)

    a_menu_importar.onclick = () => {
        //Función para importar la información de establecimientos con sus sedes
        open_importar(byE("Nombre_proyecto").textContent)
    }

    const sm_vigencia = newE("small", "sm_vigencia", "fw-bold text-white")
    sm_vigencia.textContent = "Vigencia"
    col_vigencia.appendChild(sm_vigencia)

    //Lista desplegable para vigencias
    const sel_vigencia = newE("select", "sel_vigencia", "form-control mb-2")
    col_vigencia.appendChild(sel_vigencia)

    for (ind in global_proyecto["vigencias"]) {
        const item = newE("option", "option" + ind)
        item.value = ind
        item.textContent = global_proyecto["vigencias"][ind].id
        //Se agregan las vigencias a una lista desplegable
        sel_vigencia.appendChild(item)
    }

    const row_tool_establecimiento = newE("div", "label_sedes", "row btn-label-escuela")
    panel_escritorio.appendChild(row_tool_establecimiento)


    /////////////////////////////////////////////////////////////////////////////
    /////////////////////MENU ESTABLECIMIENTO
    ////////////////////////////////////////////////////////////////////////////

    //Crea un menú desplegable para listas los establecimientos dentro de las tablas globales.
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

    const col_nombre_establecimiento = newE("div", "col_nombre_establecimiento", "col-auto")
    row_info_sede.appendChild(col_nombre_establecimiento)

    const col_nombre_sede = newE("div", "col_nombre_sedes", "col-auto")
    col_nombre_sede.textContent = ""
    row_info_sede.appendChild(col_nombre_sede)

    const col_add_estudiante = newE("div", "col_add_estudiante", "col-auto btn-menu_escuela-white")
    col_add_estudiante.textContent = ""
    row_info_sede.appendChild(col_add_estudiante)

    const col_import_estudiante = newE("div", "col_import_estudiante", "col-auto btn-menu_escuela-white")
    col_import_estudiante.textContent = ""
    row_info_sede.appendChild(col_import_estudiante)

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
                col_add_estudiante.innerHTML = ""
                col_import_estudiante.innerHTML = ""
                byE("div_estudiantes").innerHTML = ""
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
                    col_add_estudiante.textContent = "Agregar estudiante +"
                    col_import_estudiante.textContent = "Importar estudiantes..."

                    //Aquí conectamos con una de las tablas vigencia activa
                    //Debemos cargar los establecimientos y las sedes
                    administrar_vigencia(data.id, s)
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
    const div_estudiantes = newE("div", "div_estudiantes", "")
    panel_escritorio.appendChild(div_estudiantes)

    function open_importar(nombre_proyecto) {
        //Data from Drive
        const data_drive = GLOBAL.from_drive

        const modal = new bootstrap.Modal(document.getElementById('ModalImportar'));
        const texto = document.getElementById("textoModalImport")
        const btn = document.getElementById('btnAceptarImportar')
        texto.style.textAlign = "justify"
        if (data_drive.length <= 1) {
            texto.textContent = "Actualmente no cuenta con una base de datos de respaldo para este proyecto"
            btn.hidden = "true"
        } else {
            texto.innerHTML = `Mediante esta acción se procede a importar la información relacionada con
            los establecimientos y sus sedes al proyecto <b>${nombre_proyecto.toUpperCase()}</b>. Tenga en cuenta que esta acción
            <b class="text-danger">eliminará</b> la información actual de este proyecto.`
        }
        modal.show();

        btn.onclick = () => {
            //Iniciamos la estructuración de los establecimientos
            let establecimientos = []
            let data_etablecimientos = []
            data_drive.forEach(dato => {
                if (establecimientos.includes(dato.INSTITUCION) == false) {
                    establecimientos.push(dato.INSTITUCION)
                    const new_establecimiento = {
                        'nombre_corto': dato.INSTITUCION,
                        'nombre': dato.INSTITUCION,
                        'director': "Nombre director/rector",
                        'dane': dato.DANE,
                        'sedes': []
                    }
                    data_etablecimientos.push(new_establecimiento)
                }
            })

            for (id in data_etablecimientos) {
                const sede_inline = data_etablecimientos[id]
                data_drive.forEach(dato => {
                    if (dato.INSTITUCION == sede_inline.nombre) {
                        const filter_sedes = sede_inline.sedes.filter(ele => ele.nombre == dato.SEDE)
                        if (filter_sedes.length == 0) {
                            const new_sede = {
                                'nombre_corto': dato.SEDE,
                                'nombre': dato.SEDE,
                                'docente': "Docente",
                                'dane': dato.CODIGO_DANE_SEDE,
                                'estudiantes': []
                            }
                            sede_inline.sedes.push(new_sede)
                        }

                    }

                })

            }
            global_proyecto["TABLAS"]["ESTABLECIMIENTOS"] = data_etablecimientos



            global_proyecto["vigencias"][sel_vigencia.value] = []
            const id_vigencia = global_proyecto["vigencias"][sel_vigencia.value].id
            Guardar_datos(id_vigencia, global_proyecto["vigencias"][sel_vigencia.value])

            _crear_menu_establecimiento()
        }
    }

}
//Esta función administra toda la información en el momento de seleccionar una vigencia
function administrar_vigencia(id_establecimiento, id_sede) {
    //Guarda la información de todos los establecimientos
    const sede = global_proyecto["vigencias"][sel_vigencia.value]["consolidados"][id_establecimiento].sedes[id_sede]
    //Verifica si hay o no una tabla consolidados, para agregar un atalba en blanco o usar la vigente.
    //Crea una tabla en blanco con base a los establecimiento creados en TABLAS
    if (typeof global_proyecto["vigencias"][sel_vigencia.value]["consolidados"] != "undefined") {
        _crear_estudiantes_sede()
    } else {
        //Si está vacio agragar las tablas actuales en esta vigencia
        global_proyecto["vigencias"][sel_vigencia.value]["consolidados"] = global_proyecto["TABLAS"]["ESTABLECIMIENTOS"]
        const id_vigencia = global_proyecto["vigencias"][sel_vigencia.value].id
        Guardar_datos(id_vigencia, global_proyecto["vigencias"][sel_vigencia.value])
        _crear_estudiantes_sede()
    }


    function _crear_estudiantes_sede() {
        const formulario = newE("div", "formulario", "container")
        //Limpio el contenedor de la tabla
        div_estudiantes.innerHTML = ""

        //Crear uan fila donde se coloca el control de lista de campos
        /////////////CONTENEDOR MENUS Y BOTONES///////////////
        const row1 = newE("div", "row1", "row bg-secondary ms-2 align-items-center")
        div_estudiantes.appendChild(row1)
        const col_Campos = newE("div", "col_Campos", "col-md-3")
        row1.appendChild(col_Campos)
        _make_menu_campos()

        function _make_menu_campos() {
            const divCampos = newE("div", "divCampos", "dropdown mb-2")
            col_Campos.appendChild(divCampos)

            const btnCampos = newE("button", "btnCampos", "btn btn-secondary dropdown-toggle")
            btnCampos.type = "button"
            btnCampos.setAttribute("data-bs-toggle", "dropdown");
            btnCampos.textContent = "CAMPOS"
            divCampos.appendChild(btnCampos)

            const ulCampos = newE("ul", "ulCampos", "dropdown-menu p-2 shadow")
            ulCampos.style.width = "200px"
            divCampos.appendChild(ulCampos)

            ulCampos.onclick = (e) => {
                e.stopPropagation();
            }

            const crVer_todos = newE("div", "crVer_todos", "item-menu")
            crVer_todos.textContent = "Ver todos"
            crVer_todos.style.fontSize = "10pt"
            ulCampos.appendChild(crVer_todos)

            const crOcultar_todos = newE("div", "crOcultar_todos", "item-menu mb-2")
            crOcultar_todos.textContent = "Ocultar todos"
            crOcultar_todos.style.fontSize = "10pt"
            ulCampos.appendChild(crOcultar_todos)

            const ulLista_Campos = newE("ul", "ulLista_Campos", "list-group menu-group-scroll")
            ulCampos.appendChild(ulLista_Campos)

            for (i in lista_campos_estudiante) {
                const li = newE("li", "li" + i, "list-group-item")
                li.style.fontSize = "9pt"

                const check = newE("div", "fc" + i, "form-check")
                check.style.fontSize = "9pt"
                ulLista_Campos.appendChild(check)

                const inCampo = newE("input", "inCampo" + i, "form-check-input")
                inCampo.type = "checkbox"
                inCampo.checked = lista_campos_estudiante[i][2]
                check.appendChild(inCampo)

                const ind_campo = i
                inCampo.onchange = () => {
                    lista_campos_estudiante[ind_campo][2] = inCampo.checked
                    _make_tabla(data_temp)
                }

                const label_campo = newE("label", "label_campo" + i, "form-check-label")
                label_campo.for = "inCampo" + i
                label_campo.textContent = lista_campos_estudiante[i][1]
                check.appendChild(label_campo)
            }

            crOcultar_todos.onclick = () => {
                for (i in lista_campos_estudiante) {
                    lista_campos_estudiante[i][2] = false
                    byE("inCampo" + i).checked = false
                }
                _make_tabla(data_temp)
            }

            crVer_todos.onclick = () => {
                for (i in lista_campos_estudiante) {
                    lista_campos_estudiante[i][2] = true
                    byE("inCampo" + i).checked = true
                }
                _make_tabla(data_temp)
            }
            div_estudiantes.appendChild(formulario)
        }
        _make_tabla(sede)
        function _make_tabla(data) {
            formulario.innerHTML = ""
            const data_tabla = newE("table", "data_tabla", "table table-hover mt-2")
            formulario.appendChild(data_tabla)

            const data_Encabezados = newE("thead", "data_Encabezados", "m-3")
            data_tabla.appendChild(data_Encabezados)

            //Crear los encabezados dinámicamente
            const fila_Encabezado = newE("tr", "fila_Encabezado", "mb-2 bg-secondary")
            data_Encabezados.appendChild(fila_Encabezado)

            const thscope_col = newE("th", "thscope_col", "td-fitwidth-scope bg-secondary")
            thscope_col.scope = "col"
            thscope_col.textContent = "#"
            fila_Encabezado.appendChild(thscope_col)

            lista_campos_estudiante.forEach(campo => {
                if (campo[2] == true) {
                    const th = newE("th", "th" + campo[1], "tabla-cell td-fitwidth")

                    const divHColumna = newE("div", "", "dropdown")
                    th.appendChild(divHColumna)

                    const btnHColumna = newE("button", "btnCampos", "btn btn-secondary dropdown-toggle fw-bold")
                    btnHColumna.type = "button"
                    btnHColumna.style.fontSize = "9pt"
                    btnHColumna.setAttribute("data-bs-toggle", "dropdown");
                    btnHColumna.textContent = campo[1]
                    divHColumna.appendChild(btnHColumna)
                    fila_Encabezado.appendChild(th)
                    divHColumna.appendChild(_make_filter_head(campo))
                }
            }
            )
            
            //Crear cuerpo de la tabla
            const data_tbody = newE("tbody", "data_tbody", "mt-2")
            data_tabla.appendChild(data_tbody)
            let nEst = 0 //Inicia un contador por cada estudiante
            data.estudiantes.forEach(est => { //Mira cada estudiante de la vigencia
                const tr = newE("tr", "tr" + est.id, "") //Por cada caso crea una fila y la agrega a la tabla
                data_tbody.appendChild(tr)

                const th = newE("th", "", "td-fitwidth-scope") //Aquí está el numerador indice por caso
                th.scope = "row"
                th.textContent = est.id + 1
                th.onmouseover = () => {
                    //mensajes_tool("Abrir registro", "black")
                }
                th.onclick = () => { }
                tr.appendChild(th)

                //let nCol = 0 //Inicia el contador según la columna o campo 
                lista_campos_estudiante.forEach(data_columna => { //Busca en la tabla de los campos
                    if (data_columna[2] == true) { //Si el campo está visible true crear la columna
                        const td = newE("td", "", "tabla-cell td-fitwidth")
                        td.textContent = est[data_columna[0]]
                        tr.appendChild(td)
                    }
                })
                nEst++
            })

            function _make_filter_head(campo) {
                const ulFiler_Head = newE("ul", "", "dropdown-menu p-2 shadow")
                ulFiler_Head.style.width = "200px"
                ulFiler_Head.onclick = (e) => {
                    e.stopPropagation();
                }

                //Colocamos una opciòn de ver todos los registros de la lista
                const crl_ClearFiltro = newE("div", "", "item-menu")
                crl_ClearFiltro.textContent = "Ver todos"
                crl_ClearFiltro.style.fontSize = "10pt"
                ulFiler_Head.appendChild(crl_ClearFiltro)

                const crl_AplyFiltro = newE("div", "", "item-menu")
                crl_AplyFiltro.textContent = "Filtrar"
                crl_AplyFiltro.style.fontSize = "10pt"
                ulFiler_Head.appendChild(crl_AplyFiltro)
                crl_AplyFiltro.onclick = () => {
                    _filter_tabla(data)
                }


                //Filtra que elementos se ven en la lista
                const int_Filtro_listas = newE("input", campo[0], "form-control")
                int_Filtro_listas.type = "text"
                int_Filtro_listas.autocomplete = "off"
                int_Filtro_listas.style.fontSize = "10pt"
                ulFiler_Head.appendChild(int_Filtro_listas)


                const ulLista_datos = newE("ul", "", "list-group menu-group-scroll mt-2")
                ulFiler_Head.appendChild(ulLista_datos)

                //Limpiamso algún tipo de filtro actual
                crl_ClearFiltro.onclick = () => {
                    //_make_listados(clase, campo, "",numeric)
                    filtro_tabla.valores = []
                    filtro_tabla.campo = ""
                    filtro_tabla.clase = ""
                    _crear_estudiantes_sede()
                }
                _make_listados(campo[0], "", campo[3])

                int_Filtro_listas.oninput = () => {
                    _make_listados(campo[0], int_Filtro_listas.value, campo[3])
                }


                function _make_listados(campoA, filtroA, numero) {
                    ulLista_datos.innerHTML = ""
                    //Determina si el elemento pertencese o no a una clase superior de lso datos
                    //Creamos un alisata de "ùnicos" que se mostrará en el menú
                    let listasTemp = []
                    let listas = []
                    data.estudiantes.forEach(est => {
                        if (listasTemp.includes(est[campoA]) != true) {
                            listasTemp.push(est[campoA])
                        }
                    })
                    let i = 0

                    //Mira si el listado a mostrar está filtrado
                    if (filtroA !== "") {
                        if (numero == true) {
                            const filtered = listasTemp.filter(ele => ele == (filtroA))
                            listas = filtered
                        } else {
                            const filtered = listasTemp.filter(ele => ele.includes(filtroA))
                            listas = filtered
                        }

                    } else {
                        listas = listasTemp
                    }

                    //Tomamso al lista de únicos y los mostramso en formato de check
                    listas.forEach(ele => {
                        const checkE = newE("div", "fcE" + i, "form-check")
                        checkE.style.fontSize = "9pt"
                        ulLista_datos.appendChild(checkE)

                        const inCampoE = newE("input", "inCampoE" + i, "form-check-input")
                        inCampoE.type = "checkbox"
                        inCampoE.checked = false
                        inCampoE.value = ele
                        checkE.appendChild(inCampoE)

                        inCampoE.onchange = () => {
                            if (inCampoE.checked == true) {
                                filtro_tabla.valores.push(inCampoE.value)
                                filtro_tabla.campo = campo[0]
                                //filtro_tabla.clase = clase
                            } else {
                                const filtered = filtro_tabla.valores.filter(ele => ele !== inCampoE.value)
                                filtro_tabla.valores = filtered
                                filtro_tabla.campo = campo[0]
                                //filtro_tabla.clase = clase
                            }
                        }
                        const label_campoE = newE("label", "label_campoE" + i, "form-check-label fw-normal")
                        label_campoE.for = "inCampoE" + i
                        label_campoE.textContent = ele
                        checkE.appendChild(label_campoE)
                        i++

                    })
                }
                return ulFiler_Head
            }
        }
        function _filter_tabla(data) {
            const data_ini = data_temp
            //Creamos las cadenas para el filtro
            let cadena = ""
            filtro_tabla.valores.forEach(item => {
                cadena = cadena + `ele['${filtro_tabla.campo}']=='${item}' || `
            })
            const Criterio_clear = cadena.slice(0, -4)
            const filtered = data.estudiantes.filter(ele => eval(Criterio_clear))
            let data_fin = {
                "estudiantes": filtered
            };
            data_temp = data_fin
            _make_tabla(data_temp)


        }
    }


    //Referenciamos el botón para crear un estudiante nuevo.
    byE("col_add_estudiante").onclick = () => {
        //Esta sede se obtiene de la losta de establecimientos y del id de sede
        const consolidados=global_proyecto["vigencias"][sel_vigencia.value]["consolidados"]
        const sede = consolidados[id_establecimiento]["sedes"][id_sede]
        const new_estudiante = {
            'id': 0,
            'grado_cod': "",
            'nivel': "",
            'nombres': "Nombres",
            'apellidos': "Apellidos",
            'documento': "Documento",
            'tipo_documento': "00000",
            'genero': "Sin determinar",
            'fnacimiento': "00/00/0000",
            'notas': {
                'periodo1': [],
                'periodo2': [],
                'periodo3': [],
                'periodo4': []
            },
        }
        sede.estudiantes.push(new_estudiante)
        global_proyecto["vigencias"][sel_vigencia.value]["consolidados"][id_establecimiento]["sedes"][id_sede] = sede
        const id_vigencia = global_proyecto["vigencias"][sel_vigencia.value].id
        Guardar_datos(id_vigencia, global_proyecto["vigencias"][sel_vigencia.value])
        data_filter_estudiantes = consolidados[id_establecimiento]["sedes"][id_sede]
        _crear_estudiantes_sede()

    }

    const btn_importar_estudiante = byE("col_import_estudiante")
    btn_importar_estudiante.onclick = () => {
        const consolidados=global_proyecto["vigencias"][sel_vigencia.value]["consolidados"]
        const sede = consolidados[id_establecimiento]["sedes"][id_sede]
        _importar_estudiantes()

        function _importar_estudiantes() {
            const modal = new bootstrap.Modal(document.getElementById('ModalImportar'));
            const texto = document.getElementById("textoModalImport")
            const btn = document.getElementById('btnAceptarImportar')
            texto.style.textAlign = "justify"
            const data_drive = GLOBAL.from_drive
            if (data_drive.length <= 1) {
                texto.textContent = "Actualmente no cuenta con una base de datos de respaldo para este proyecto"
                btn.hidden = "true"
            } else {
                texto.innerHTML = `Mediante esta acción se procede a importar la información relacionada con
               la sede <b>${sede.nombre.toUpperCase()}</b>. Tenga en cuenta que esta acción
                <b class="text-danger">eliminará</b> la información de toda la sede`
            }
            modal.show();

            btn.onclick = () => {
                let e = 0
                data_drive.forEach(dato => {
                    const Nivel = cod_grados["N" + dato.GRADO_COD]
                    if (dato.CODIGO_DANE_SEDE == sede.dane) {

                        const new_estudiante = {
                            'id': e,
                            'grado_cod': `${dato.GRADO_COD}`,
                            'nivel': cod_grados[dato.GRADO_COD].nombre.replace(0, ""),
                            'nombres': `${dato.NOMBRE1} ${dato.NOMBRE2}`,
                            'apellidos': `${dato.APELLIDO1} ${dato.APELLIDO2}`,
                            'documento': `${dato.DOC}`,
                            'tipo_documento': `${dato.TIPODOC}`,
                            'genero': `${dato.GENERO}`,
                            'fnacimiento': `${dato.FECHA_NACIMIENTO}`,
                            'notas': {
                                'periodo1': [],
                                'periodo2': [],
                                'periodo3': [],
                                'periodo4': []
                            },
                        }
                        e++
                        sede.estudiantes.push(new_estudiante)
                    }
                })
                global_proyecto["vigencias"][sel_vigencia.value]["consolidados"][id_establecimiento]["sedes"][id_sede] = sede
                data_filter_sede = sede
                const id_vigencia = global_proyecto["vigencias"][sel_vigencia.value].id
                Guardar_datos(id_vigencia, global_proyecto["vigencias"][sel_vigencia.value])
                _crear_estudiantes_sede()
            }
        }
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


