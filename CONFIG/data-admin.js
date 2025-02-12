//Importa las instanacias de firebase y administración de base de datos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";


//importa las acciones para almacenar en la nube
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    addDoc,
    setDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    deleteField,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

//Importa las instanacias de firebase para autenticación
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Utiliza las claves y credenciales de mi base de datos de Tomakare
const firebaseConfig = {
    apiKey: "AIzaSyBD-VWbVbySQuKAzqe2M78njrGhEEW1K1c",
    authDomain: "swanpatpo.firebaseapp.com",
    projectId: "swanpatpo",
    storageBucket: "swanpatpo.firebasestorage.app",
    messagingSenderId: "517037223482",
    appId: "1:517037223482:web:ddcf150ceae84aa5874f03"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);



function _sele_escuela(proyecto) {
    //Sección para importar data del DRIVE
    // Cargar informacion de la base de datos de registros de tabla google
function loadDataBase(id, hoja, query = "Select *") {
    //Carga base de datos de google sheets y la convierte a una lista

    //let query = "Select A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W"
    return fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}&tq=${encodeURIComponent(query)}`)
        .then(response => response.text())
        .then(text => {
            //Cargar Datos
            const rawdata = text.slice(47, -2);
            const data = ((JSON.parse(rawdata)).table);


            //Titulos de columnas y Obtener columnas
            const cols = (data.cols);
            const Keys = cols.map(col => col.label);
            const rows = data.rows;

            //Regresar Objeto (Diccionario Json)
            const Objeto = [];
            for (const row of rows) {
                const raw = (row.c)
                const rowinfo = raw.map(dic => (dic && dic.v) ? dic.v : "No registra");
                const caso = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i]]));
                Objeto.push(caso)
            }


            return Objeto
        })
}


let DataPrincipal;
loadDataBase("1dniplVXfiSFYUFfsT1Ij6cdEoAdtK7dqWf3x4s9eUSw", proyecto).then(objeto => {
    DataPrincipal = [...objeto].sort((a, b) => a[0] - b[0]);
    GLOBAL.from_drive=DataPrincipal
})
/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

    const colectionproyectos=collection(db, proyecto)
    // 1.
    async function getProyecto() {
        const proyectos = [];
        const querySnapshot = await getDocs(proyecto)
        querySnapshot.forEach((doc) => {
            proyectos.push({
                ...doc.data(),
                id: doc.id,
            });
        });
        return proyectos;
    }
    // 2.
    // Función para obtener un proyecto por id
    async function getProyectos(id) {
        const docRef = doc(db, proyecto, id);
        const docSnap = await getDoc(docRef);

        return docSnap.exists() ? ({
            ...docSnap.data(),
            id: docSnap.id,
        }) : null;
    }
    //3.
    // Función para actualizar un proyecto
    async function updateProyecto(datos) {
        const docRef = doc(db, proyecto, datos.id);
        await setDoc(docRef, datos);
    }

    //4.
    // Escuchar si hay en un cambio en la coleccion de vigencias y actualizar automaticamente la lista de proyectos
    onSnapshot(colectionproyectos, (querySnapshot) => {
        const proyectos = [];
        querySnapshot.forEach((doc) => {
            proyectos.push({
                ...doc.data(),
                id: doc.id,
            });
        });
        GLOBAL.state.proyectos = proyectos;
    });
    GLOBAL.firestore = {
        getProyectos,
        getProyecto,
        updateProyecto,
    }

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
        _sele_escuela(proyecto[0])
        mensajes("El acceso se ha completado con éxito","green")
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






