import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged , signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
let inactivityTimer;
const eventsTimer = ["mousemove", "keydown", "click", "scroll"];

// Declarar el elemento HTML una vez
const titulo = document.getElementById("titulo");
const estado = document.getElementById("estado");
onAuthStateChanged(auth, async (user) => {
    const titulo = document.getElementById("titulo");
    const estado = document.getElementById("estado");
     const contenido = document.getElementById("contenido");
    if (user) {
        console.log("Usuario logueado:", user.uid);

        const docRef = doc(db, "pacientes", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.sexo === "mujer") {
                // Mostrar los datos del usuario (puedes adaptarlo según tu estructura)
                titulo.textContent = `Bienvenida, ${data.nombre || "usuario"}`;

            }
            else {
                // Mostrar los datos del usuario (puedes adaptarlo según tu estructura)
                titulo.textContent = `Bienvenido, ${data.nombre || "usuario"}`;
            }
              contenido.style.display = "block";
        } else {
            estado.textContent = "El usuario no tiene guardados datos.";
        }
    } else {
        estado.textContent = "No hay usuario logueado. Redirigiendo al login...";
        window.location.href = "index.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const btnDatos = document.getElementById("btnDatos");
    const btnRecetas = document.getElementById("btnRecetas")
    const btnConsejos = document.getElementById("btnConsejos");
    const btnCitas = document.getElementById("btnCitas");
    const btnMensajes = document.getElementById("btnMensajes");
    const btnEjercicios = document.getElementById("btnEjercicios")
    btnDatos.addEventListener("click", () => {
        window.location.href = "paginas/datosMedicos/cuestionario.html"
    });
    btnRecetas.addEventListener("click", () => {
        window.location.href = "paginas/recetas.html"
    });
    btnConsejos.addEventListener("click", () => {
        window.location.href = "paginas/consejos.html"
    });
    btnCitas.addEventListener("click", () => {
        window.location.href = "paginas/citas.html"
    });
    btnMensajes.addEventListener("click", () => {
        window.location.href = "paginas/mensajes.html"
    });
    btnEjercicios.addEventListener("click", () => {
        window.location.href = "paginas/ejercicios.html"
    });
});


function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        signOut(auth).then(() => {
            alert("Sesión cerrada por inactividad.");
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
    }, 30 * 60 * 1000); // 30 minutos
}

// Escuchar eventos una sola vez
["mousemove", "keydown", "click", "scroll"].forEach(event => {
    document.addEventListener(event, resetTimer);
});

resetTimer(); // Iniciar el temporizador al cargar