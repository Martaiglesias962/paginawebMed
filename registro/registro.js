import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Usuario } from "../general/modeloUsuario.js"
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBB5zHSFim0ZFEhvJDiiH7ShRfr9gCXrsU",
    authDomain: "cuestionario-9410a.firebaseapp.com",
    projectId: "cuestionario-9410a",
    storageBucket: "cuestionario-9410a.appspot.com",
    messagingSenderId: "777596732942",
    appId: "1:777596732942:web:270a5495602a6ec24c9e5f",
    measurementId: "G-H6ZSDXC7MJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const btnRegister = document.getElementById("btnRegister");
    const estado = document.getElementById("estado");

    btnRegister.addEventListener("click", async () => {
        // Leer valores al hacer clic
        const nombre = document.getElementById("nombreReg").value.trim();
        const apellido = document.getElementById("apellidoReg").value.trim();
        const email = document.getElementById("emailReg").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimientoReg").value.trim();
        const password = document.getElementById("passReg").value.trim();
        const confirmarPass = document.getElementById("confirmarPassRef").value.trim();
        const rolRadio = document.querySelector('input[name="rol"]:checked');
        const sexoInput = document.querySelector('input[name=sexo]:checked');
        const sexo = sexoInput ? sexoInput.value.trim() : "";
        // Validaciones
        if (!nombre || !apellido || !email || !fechaNacimiento || !password || !confirmarPass || !rolRadio || !sexo) {
            estado.textContent = "Por favor, completa todos los campos.";
            estado.style.color = "red";
            return;
        }

        if (password !== confirmarPass) {
            estado.textContent = "Las contraseñas no coinciden.";
            estado.style.color = "red";
            return;
        }

        // Validación de edad
        const nacimiento = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

        if (edad < 18) {
            estado.textContent = "Debes ser mayor de edad.";
            estado.style.color = "red";
            return;
        }

        // Obtener rol
        const rol = rolRadio.value;
        const coleccion = rol === "paciente" ? "pacientes" : "profesionales";

        try {
            // Crear usuario en Firebase Auth
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = cred.user.uid;

            // Guardar datos en Firestore
            const nuevoUsuario = new Usuario({ nombre, apellido, email, fechaNacimiento, rol, uid, sexo });

            await setDoc(doc(db, coleccion, uid), nuevoUsuario.toPlainObject());

            estado.textContent = `Registro exitoso. ¡Bienvenido/a ${nombre}!`;
            estado.style.color = "green";
            if (rol === "paciente") {
                // Redirigir a página de paciente
                window.location.href = "../paciente/principal-paciente.html";
            } else {
                // Redirigir a página de profesional
                window.location.href = "../medico/principal-medicos.html";
            }

        } catch (error) {
            let mensaje = "Error al registrar el usuario.";
            switch (error.code) {
                case "auth/invalid-email":
                    mensaje = "El correo electrónico no es válido.";
                    break;
                case "auth/email-already-in-use":
                    mensaje = "El correo electrónico ya está registrado.";
                    break;
                case "auth/weak-password":
                    mensaje = "La contraseña debe tener al menos 6 caracteres.";
                    break;
                default:
                    mensaje = "Error inesperado: " + error.message;
            }
            estado.textContent = mensaje;
            estado.style.color = "red";
            console.error(error);
        }
    });
});
