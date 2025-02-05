//Control que muestra el ingreso de una nueva sede


const sm_nombre_newSede = newE("small", "sm_nombre_newSede", "fw-bold")
sm_nombre_newSede.textContent="Nombre de la sede"
div_add_sedes.appendChild(sm_nombre_newSede)

const in_nombre_newSede = newE("input", "in_nombre_newSede", "form-control")
in_nombre_newSede.type="text"
div_add_sedes.appendChild(in_nombre_newSede)

const sm_dane_newSede = newE("small", "sm_dane_newSede", "fw-bold")
sm_dane_newSede.textContent="Código DANE"
div_add_sedes.appendChild(sm_dane_newSede)

const in_dane_newSede = newE("input", "in_dane_newSede", "form-control")
in_dane_newSede.type="text"
div_add_sedes.appendChild(in_dane_newSede)

const btn_newSede = newE("input", "btn_newSede", "form-control")

function _sele_escuela(proyecto) {


}
const colectionproyectos = collection(db, "proyecto_bari")
// 1.
async function getEscuela() {
    const escuelas = [];
    const querySnapshot = await getDocs("proyecto_bari")
    querySnapshot.forEach((doc) => {
        escuelas.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return escuelas;
}
// 2.
// Función para obtener un proyecto por id
async function getEscuelas(id) {
    const docRef = doc(db, "proyecto_bari", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}
//3.
// Función para actualizar un proyecto
async function updateEscuelas(datos) {
    //const docRef = doc(db, proyecto, 0);
    console.log(doc(db, "proyecto_bari", 1))
    //await setDoc(docRef, datos);
}

//4.
// Escuchar si hay en un cambio en la coleccion de vigencias y actualizar automaticamente la lista de proyectos
onSnapshot(colectionproyectos, (querySnapshot) => {
    const escuelas = [];
    querySnapshot.forEach((doc) => {
        escuelas.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    GLOBAL.state.escuela = escuelas;
});
GLOBAL.firestore = {
    getEscuelas,
    getEscuela,
    updateEscuelas,
}
//Función que escucha el cambio en inicio o cerrar sesión
onAuthStateChanged(auth, async (user) => {
    //console.log(GLOBAL.state)

})
//Función para autorizar ingreso a la base de datos
async function Verificar_Acceso(email, password) {
    try {
        const crearcredencial = await signInWithEmailAndPassword(auth, email, password)
        const proyecto = email.split("@")
        _sele_escuela("proyecto_bari")
        mensajes("El acceso se ha completado con éxito", "green")
        openIni(email)



    } catch (error) {
        mensajes("Su usuario y contraseña no son correctos", "orange")

    }

}
async function CredentialOut() {
    await signOut(auth)
    location.href = "../index.html"
}

GLOBAL.admin = {
    _sele_escuela,
    Verificar_Acceso,
    CredentialOut,
}

function open_escuela() {
    const escuela = GLOBAL.state.escuela
    let vigencias = []
    for (id in escuela) {
        if (escuela[id].id == "PROYECTO") {
            global_escuela["proyecto"] = escuela[id].nombre
            byE("Nombre_proyecto").textContent = escuela[id].nombre
        } else if (escuela[id].id.includes("V-") == true) {
            vigencias.push(escuela[id])
            //console.log(escuela[id])
        } else if (escuela[id].id == "TABLAS") {
            global_escuela["TABLAS"] = escuela[id]
        }

    }
    global_escuela["vigencias"] = vigencias


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

    global_escuela["vigencias"].forEach(vig => {
        const item = newE("option", "option" + vig.id)
        item.value = vig.id
        item.textContent = vig.id
        sel_vigencia.appendChild(item)
    });

    const col_establecimientos = newE("div", "col_establecimientos", "col-md-3")
    row_tools.appendChild(col_establecimientos)

    const sm_establecimientos = newE("small", "sm_vigencia", "fw-bold text-white")
    sm_establecimientos.textContent = "Establecimientos"
    col_establecimientos.appendChild(sm_establecimientos)

    const sel_establecimientos = newE("select", "sel_establecimientos", "form-control mb-2")
    col_establecimientos.appendChild(sel_establecimientos)

    const row_tool_sedes = newE("div", "label_sedes", "row btn-label-escuela")
    panel_escritorio.appendChild(row_tool_sedes)

    const col_tit_sedes = newE("div", "col_tit_sedes", "col-md-3 fw-bold")
    col_tit_sedes.textContent = "Establecimientos"
    row_tool_sedes.appendChild(col_tit_sedes)

    const col_add_establecimiento = newE("div", "col_add_establecimiento", "col-md-3 item-menu-escuela")
    col_add_establecimiento.textContent = "Agregar establecimiento +"
    row_tool_sedes.appendChild(col_add_establecimiento)

    const div_add_establecimiento = newE("div", "div_add_establecimiento", "border border-1 border-secondary m-1")
    div_add_establecimiento.textContent="Establecimientos"
    panel_escritorio.appendChild(div_add_establecimiento)


    //Leo la tabla de establecimientos y verifico si hay o no datos

    if (typeof global_escuela["TABLAS"]["ESTABLECIMIENTOS"] != "undefined") {
        alert("GOT THERE");
    } else {
        const item = newE("option", "option_blank")
        item.value = "0"
        item.textContent = "Sin establecimientos"
        sel_establecimientos.appendChild(item)
        //global_escuela["TABLAS"]["ESTABLECIMIENTOS"]=[]
    }

    col_add_establecimiento.onclick=()=>{
        let n_dane={}
        const new_establecimiento={
            'nombre':"Nuevo establecimiento",
            'director':"Nombre director/rector",
            'dane':234567,
            'sedes':[]
        }
        //global_escuela["TABLAS"]={}
        
        GuardarDatos("TABLAS",global_escuela["TABLAS"])

    }



    function _crear_establecimiento(){

    }

    function GuardarDatos(tabla,data) {
        GLOBAL.state.publicos[1]=data
        const id = GLOBAL.firestore.updatePublico(GLOBAL.state.publicos[1])
    }
    //console.log(GLOBAL.state.escuela)
}
