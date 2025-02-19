function _put_filter_head(data_estudiantes, campo) {
    const ulCampos = newE("ul", "ulCampos", "dropdown-menu shadow p-1")
    ulCampos.style.width = "200px"

    const div_filtrar = newE("div", "div_filtrar" + campo, "item-menu")
    div_filtrar.textContent = "Filtrar"
    ulCampos.appendChild(div_filtrar)
    div_filtrar.onclick = () => {
        //botón  y función para aplicar un filtro con base a una lista de criterios
        _filter_data(campo,"filter")
    }


    const div_filtrar_clear = newE("div", "div_filtrar_clear" + campo, "item-menu")
    div_filtrar_clear.textContent = "Limpiar filtro"
    ulCampos.appendChild(div_filtrar_clear)
    div_filtrar_clear.onclick = () => {
        _filter_data(campo,"clear")
    }

    ulCampos.onclick = (e) => {
        e.stopPropagation();
    }
    const divUl_filter = newE("div", "divUl_filter" + campo, "menu-group-scroll")
    ulCampos.appendChild(divUl_filter)

    //Creamos listas por cada campo
    let list_campo = []
    let d = 0
    data_estudiantes.forEach(dato => {
        if (list_campo.includes(dato[campo]) == false) {
            list_campo.push(dato[campo])

            const check = newE("div", "fc" + d, "form-check")
            check.style.fontSize = "9pt"
            divUl_filter.appendChild(check)

            const inCampo = newE("input", "inCampo" + d, "form-check-input")
            inCampo.type = "checkbox"
            inCampo.checked = false
            check.appendChild(inCampo)

            inCampo.onchange = () => {
                if (list_filter_estudiantes.includes(dato[campo]) == false) {
                    list_filter_estudiantes.push(dato[campo])
                } else {
                    const filtered = list_filter_estudiantes.filter(ele => ele != dato[campo])
                    list_filter_estudiantes = filtered
                }
            }

            const label_campo = newE("label", "label_campo" + d, "form-check-label fw-normal")
            label_campo.for = "inCampo" + d
            label_campo.textContent = dato[campo]
            check.appendChild(label_campo)
        }

    })
    return ulCampos
}
function _filter_data(campo,type_filter) {
    const sede = consolidados[id_establecimiento]["sedes"][id_sede]
    //Construir la lista de criterio
    let criterios = ""
    list_filter_estudiantes.forEach(criterio => {
        criterios = criterios + `ele['${campo}']=='${criterio}'||`
    })
    const Criterio_clear = criterios.slice(0, -2)

    let filtered
    if(type_filter=="clear"){
        filtered=sede.estudiantes.filter(ele => ele[campo]!="")
        consolidados[id_establecimiento]["sedes"][id_sede]=data_filter_sede_ori
        byE("tbody_estudiantes").innerHTML = ""
        _crear_estudiantes_sede(false)
    }else{
        filtered=sede.estudiantes.filter(ele => eval(Criterio_clear))
        list_filter_estudiantes=[]
        data_filter_sede=filtered
        byE("tbody_estudiantes").innerHTML = ""
        _crear_estudiantes_sede(true)
    }


}
function _crear_estudiantes_sede(filter) {
    div_estudiantes.innerHTML = ""

    //Creamos una tabla de estudiantes
    const tabla_estudiantes = newE("table", "data_tabla", "table table-hover mt-2")
    div_estudiantes.appendChild(tabla_estudiantes)
    const data_encabezados = newE("thead", "data_encabezados", "m-3")
    tabla_estudiantes.appendChild(data_encabezados)

    //Crear los encabezados dinámicamente
    const fila_Encabezado = newE("tr", "fila_Encabezado", "mb-2 bg-secondary")
    data_encabezados.appendChild(fila_Encabezado)

    const thscope_col = newE("th", "thscope_col", "td-fitwidth-scope bg-secondary")
    thscope_col.scope = "col"
    thscope_col.textContent = "#"
    fila_Encabezado.appendChild(thscope_col)

    let h = 0
    //Crear lista de encabezados en relación a una lista de campos predefinido
    lista_datos_estudiante.forEach(campo => {
        if (campo[2] == true) {
            //Los encabezados se crean con control de filtro por columna
            const th = newE("th", "th" + campo[1], "tabla-cell td-fitwidth")
            fila_Encabezado.appendChild(th)

            const divHColumna = newE("div", "", "dropdown")
            th.appendChild(divHColumna)

            const btnHColumna = newE("button", "btnCampos" + h, "btn btn-secondary dropdown-toggle fw-bold")
            btnHColumna.type = "button"
            btnHColumna.style.fontSize = "9pt"
            btnHColumna.setAttribute("data-bs-toggle", "dropdown");
            btnHColumna.textContent = campo[1]
            divHColumna.appendChild(btnHColumna)
            h++
            const sede = consolidados[id_establecimiento]["sedes"][id_sede]
            divHColumna.appendChild(_put_filter_head(sede.estudiantes, campo[0]))
        }
    }
    )


    const tbody_estudiantes = newE("tbody", "tbody_estudiantes", "mb-2")
    tabla_estudiantes.appendChild(tbody_estudiantes)

    let sede_est = consolidados[id_establecimiento]["sedes"][id_sede]
    if(filter==false){
        sede_est = consolidados[id_establecimiento]["sedes"][id_sede]
        data_filter_sede_ori=consolidados[id_establecimiento]["sedes"][id_sede]
    }else{
        sede_est.estudiantes = data_filter_sede
    }

    sede_est.estudiantes.forEach(est => {
        const tr = newE("tr", "tr" + est.id, "")
        tbody_estudiantes.appendChild(tr)

        const th_id = newE("th", "th" + est.id, "")
        th_id.textContent = est.id
        tr.appendChild(th_id)

        const td_grado = newE("td", "td_grado" + est.id, "")
        td_grado.textContent = est.grado_cod
        tr.appendChild(td_grado)

        const td_nivel = newE("td", "td_nivel" + est.id, "")
        td_nivel.textContent = est.nivel
        tr.appendChild(td_nivel)

        const td_nombres = newE("td", "td_nombres" + est.id, "")
        td_nombres.textContent = est.nombres
        tr.appendChild(td_nombres)

        const td_apellidos = newE("td", "td_apellidos" + est.id, "")
        td_apellidos.textContent = est.apellidos
        tr.appendChild(td_apellidos)

        const td_documento = newE("td", "td_documento" + est.id, "")
        td_documento.textContent = est.documento
        tr.appendChild(td_documento)

        const td_tipodocumento = newE("td", "td_tipodocumento" + est.id, "")
        td_tipodocumento.textContent = est.tipo_documento
        tr.appendChild(td_tipodocumento)

        const td_genero = newE("td", "td_genero" + est.id, "")
        td_genero.textContent = est.genero
        tr.appendChild(td_genero)

        const td_fnacimiento = newE("td", "td_fnacimiento" + est.id, "")
        td_fnacimiento.textContent = est.fnacimiento
        tr.appendChild(td_fnacimiento)
    })


}