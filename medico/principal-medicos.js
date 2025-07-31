import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const storage = getStorage(app);

// Elementos del DOM
const nombre = document.getElementById("nombreDoct");
const especialidad = document.getElementById("espDoc");
const email = document.getElementById("emailDoc");
const numCol = document.getElementById("numCole");
const inputEsp = document.getElementById("inputEsp");
const campoEsp = document.getElementById("campoEsp");
const inputCol = document.getElementById("inputCol");
const campoCol = document.getElementById("campoCol");
const campoEmail = document.getElementById("campoEmail");
const inputEmail = document.getElementById("inputEmail");
const btn = document.getElementById("btnActPerfil");
const btnFoto = document.getElementById("btnSubirFoto");
const campoImagen = document.getElementById("campoImagen");
const fotoPerfil = document.getElementById("fotoPerfil");

//botones funcionalidad
const btnAnadirPac = document.getElementById("btnAnadirPac");
const btnVerPac = document.getElementById("btnVerPac");
const btnmensajes = document.getElementById("btnmensajes");
const btnCitas = document.getElementById("btnCitas");
let modoEdicion = false;
let dataUsuario = null; // Guardamos los datos de Firestore por si se necesitan

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Usuario logueado:", user.uid);
        if (user.photoURL) {
            fotoPerfil.src = user.photoURL;
        }
        const docRef = doc(db, "profesionales", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            dataUsuario = docSnap.data();
            console.log(dataUsuario);

            // Rellenar campos
            email.innerHTML = `<strong>Email:</strong> ${dataUsuario.email}`;
            numCol.innerHTML = `<strong>Número de colegiado:</strong> ${dataUsuario.colegiado ?? ''}`;
            especialidad.innerHTML = `<strong>Especialidad:</strong> ${dataUsuario.especialidad ?? ''}`;

            if (dataUsuario.sexo === "mujer") {
                nombre.textContent = `Panel de la Dra. ${dataUsuario.nombre} ${dataUsuario.apellido}`;
            } else {
                nombre.textContent = `Panel del Dr. ${dataUsuario.nombre} ${dataUsuario.apellido}`;
            }
        } else {
            console.log("No se encontró el documento del usuario.");
        }
    } else {
        window.location.href = "index.html";
    }
});

fotoPerfil.addEventListener("change", () => {
    const file = fotoPerfil.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById("imgPerfil").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Lógica para alternar entre mostrar/editar especialidad
btn.addEventListener("click", async () => {
    if (!modoEdicion) {
        // Mostrar input para edición
        inputEsp.value = dataUsuario?.especialidad || "";
        inputCol.value = dataUsuario?.colegiado || "";
        inputEmail.value = dataUsuario?.email || "";

        campoEmail.style.display = "block";
        campoCol.style.display = "block";
        campoEsp.style.display = "block";
        campoImagen.style.display = "block";

        especialidad.style.display = "none";
        numCol.style.display = "none";
        email.style.display = "none";

        btn.textContent = "Guardar datos";
        modoEdicion = true;
    } else {
        // Guardar nueva especialidad (solo en pantalla por ahora)
        const nuevaEsp = inputEsp.value.trim();
        const nuevoCol = inputCol.value.trim();
        const nuevoEmail = inputEmail.value.trim();


        const file = fotoPerfil.files[0];
        const imgPerfil = document.getElementById("imgPerfil");
        let nuevaFotoURL = auth.currentUser.photoURL;
        if (file) {
            try {
                const storageRef = ref(storage, `fotosPerfil/${auth.currentUser.uid}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                await updateProfile(auth.currentUser, { photoURL: url });
                nuevaFotoURL = url;
                imgPerfil.src = url;
            } catch (error) {
                console.error("Error al subir imagen:", error);
            }
        }


        const user = auth.currentUser;

        if (user) {
            try {
                const ref = doc(db, "profesionales", user.uid);
                await updateDoc(ref, {
                    especialidad: nuevaEsp,
                    colegiado: nuevoCol,
                    email: nuevoEmail,
                    photoURL: nuevaFotoURL
                });
                console.log("Datos actualizados correctamente en Firestore");
            } catch (error) {
                console.error("Error al actualizar en Firestore:", error);
                alert("Hubo un error al guardar los datos.");
            }
        }

        especialidad.innerHTML = `<strong>Especialidad:</strong> ${nuevaEsp}`;
        numCol.innerHTML = `<strong>Número de colegiado:</strong> ${nuevoCol}`;
        email.innerHTML = `<strong>Email:</strong> ${nuevoEmail}`;
        campoEsp.style.display = "none";
        campoEmail.style.display = "none";
        campoCol.style.display = "none";
        campoImagen.style.display = "none";
        especialidad.style.display = "block";
        numCol.style.display = "block";
        email.style.display = "block";
        btn.textContent = "Actualizar perfil";
        modoEdicion = false;


    }
});

btnAnadirPac.addEventListener("click", () => {
    window.location.href = "carpetasMed/anadirPacientes.html";
});
btnVerPac.addEventListener("click", () => {
    window.location.href = "carpetasMed/listaPacientes.html";
});
btnmensajes.addEventListener("click", () => {
    window.location.href = "carpetasMed/mensajes.html";
});
btnCitas.addEventListener("click", () => {
    window.location.href = "carpetasMed/citas.html";
});