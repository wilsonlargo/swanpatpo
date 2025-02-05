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
        const docRef = doc(db, proyecto, "TABLAS");
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






