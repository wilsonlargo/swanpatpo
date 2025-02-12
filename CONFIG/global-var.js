const GLOBAL = {
    state: {
        //vigencia: null,
        proyectos: [],
    },
    firestore: {},
    admin: {},
    from_drive:[]
};
let activeEmail;
function IniCredential() {
    //Lee la información del form,ulario de ingreso en index.html
    const email = document.getElementById("inEmail").value
    const password = document.getElementById("inPass").value

    //Evoca la función global de ingreso, en archivo (cinfirdata.js) 
    GLOBAL.admin.Verificar_Acceso(email, password)


}
function SignOut() {
    GLOBAL.admin.CredentialOut()
}
function autenticar() {
    const modal = new bootstrap.Modal(document.getElementById('myModal'));
    const texto = document.getElementById("textoModal")
    modal.show();
    const btn = document.getElementById('btnConfirm')
    btn.onclick = () => IniCredential()
}


function mensajes(text, color) {
    Toastify({
        text: text,
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
            color: "white",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}
let byE = (elemento) => {
    const el = document.getElementById(elemento)
    return el
}
let newE = (elemento, id, clase, ancho) => {
    const el = document.createElement(elemento)
    el.id = id
    el.className = clase
    el.style.width = ancho
    return el
}

const cod_grados={
    "-2":{
        'nombre':'Primera infancia'
    },
    "-1":{
        'nombre':'Primera infancia'
    },
    "P":{
        'nombre':'Prescolar'
    },
    "1":{
        'nombre':'Primaria'
    },
    "2":{
        'nombre':'Primaria'
    },
    "3":{
        'nombre':'Primaria'
    },
    "4":{
        'nombre':'Primaria'
    },
    "5":{
        'nombre':'Primaria'
    },
    "6":{
        'nombre':'Posprimaria'
    },
    "7":{
        'nombre':'Posprimaria'
    },
    "8":{
        'nombre':'Posprimaria'
    },
    "9":{
        'nombre':'Posprimaria'
    },
    "10":{
        'nombre':'Media'
    },
    "11":{
        'nombre':'Media'
    },
}