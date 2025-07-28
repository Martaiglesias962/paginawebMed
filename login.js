import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const estado = document.getElementById("estado");

    btnLogin.addEventListener("click", async () => {
        const email = document.getElementById("emailLogin").value.trim();
        const password = document.getElementById("passLogin").value.trim();

        if (!email || !password) {
            estado.textContent = "Por favor, completa todos los campos.";
            estado.style.color = "red";
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔎 Buscar en pacientes
            const docPacienteRef = doc(db, "pacientes", user.uid);
            const docPacienteSnap = await getDoc(docPacienteRef);

            if (docPacienteSnap.exists()) {
                estado.textContent = "Inicio de sesión exitoso como paciente.";
                estado.style.color = "green";
                window.location.href = "principal-paciente.html";
                return;
            }

            // 🔎 Buscar en profesionales
            const docMedicoRef = doc(db, "profesionales", user.uid);
            const docMedicoSnap = await getDoc(docMedicoRef);

            if (docMedicoSnap.exists()) {
                estado.textContent = "Inicio de sesión exitoso como profesional.";
                estado.style.color = "green";
                window.location.href = "principal-medicos.html";
                return;
            }

            // No está en ninguna colección
            estado.textContent = "Usuario no encontrado en Firestore.";
            estado.style.color = "red";

        } catch (error) {
            let mensaje = "Error al iniciar sesión.";
            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                    mensaje = "Correo o contraseña incorrectos.";
                    break;
                case "auth/invalid-email":
                    mensaje = "El correo no es válido.";
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
