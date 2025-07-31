import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { Usuario } from "../../../general/modeloUsuario.js";

// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBB5zHSFim0ZFEhvJDiiH7ShRfr9gCXrsU",
    authDomain: "cuestionario-9410a.firebaseapp.com",
    projectId: "cuestionario-9410a",
    storageBucket: "cuestionario-9410a.appspot.com",
    messagingSenderId: "777596732942",
    appId: "1:777596732942:web:270a5495602a6ec24c9e5f",
    measurementId: "G-H6ZSDXC7MJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const estado = document.getElementById("estado");
    const btnGuardar = document.getElementById("btnGuardar");
    const btnMenuPrincipal = document.getElementById("btnMenuPrincipal");

    btnMenuPrincipal.addEventListener("click", () => {
        window.location.href = "../../principal-paciente.html";
    });

    btnGuardar.addEventListener("click", () => {
        let datosValidos = true;
        // Elementos del DOM
        const inputNombre = document.getElementById("CuestNombre");
        const inputApellido = document.getElementById("CuestApellido");
        const inputFechaNacimiento = document.getElementById("fechaNacimientoReg");
        const inputPeso = document.getElementById("pesoReg");
        const inputAltura = document.getElementById("alturaReg");
        const inputAlergias = document.getElementById("alergiasReg");
        const inputMedicamentos = document.getElementById("medicamentosReg");
        const inputEnfermedades = document.getElementById("enfermedadesReg");
        const inputSexo = document.querySelector('input[name="sexo"]:checked');
        const inputFumador = document.querySelector('input[name="fumador"]:checked');

        const nombre = inputNombre.value.trim();
        const apellido = inputApellido.value.trim();
        const fechaNacimiento = inputFechaNacimiento.value.trim();
        const peso = parseFloat(inputPeso.value);
        const altura = parseFloat(inputAltura.value);
        const alergias = inputAlergias.value.trim();
        const medicamentos = inputMedicamentos.value.trim();
        const enfermedades = inputEnfermedades.value.trim();
        const sexo = inputSexo ? inputSexo.value : "";
        const fumador = inputFumador ? inputFumador.value : "";

        const estPeso = document.getElementById("estPeso");
        if (pesoInvalido(peso)) {
            estPeso.textContent = "*introduce un peso válido";
            estPeso.style.color = "#b00020";
            datosValidos = false;
        } else {
            estPeso.textContent = "";
        }
        const esAltura = document.getElementById("estAltura");
        if (alturaInvalida(altura)) {

            esAltura.textContent = "*introduce una altura válida";
            esAltura.style.color = "#b00020";
            datosValidos = false;

        } else {
            esAltura.textContent = "";
        }
        const estFum = document.getElementById("estFum");
        if (fumador === "") {
            estFum.textContent = "*Indica si eres fumador o no.";
            estFum.style.color = "#b00020";
            datosValidos = false;
        }
        if (datosValidos === false) {
            return;
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "pacientes", user.uid);

                try {
                    await updateDoc(docRef, {
                        nombre,
                        apellido,
                        fechaNacimiento,
                        peso,
                        altura,
                        alergias,
                        medicamentos,
                        enfermedades,
                        sexo,
                        fumador
                    });

                    const updatedSnap = await getDoc(docRef);
                    const data = updatedSnap.data();

                    estado.textContent = "Datos guardados correctamente";

                    estado.style.color = "green";
                    window.location.href = "../../principal-paciente.html";

                } catch (error) {
                    console.error("Error al actualizar datos:", error);
                    estado.textContent = "❌ Error al guardar los datos.";
                    estado.style.color = "red";
                }

            } else {
                console.log("Usuario no autenticado");
                estado.textContent = "Debes iniciar sesión.";
                estado.style.color = "red";
            }
        });
    });
});
function pesoInvalido(peso) {
    return isNaN(peso) || peso < 20 || peso > 300;
}
function alturaInvalida(altura) {
    return isNaN(altura) || altura < 100 || altura > 250;
}