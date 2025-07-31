export class Usuario {
    constructor({ nombre, apellido, email, fechaNacimiento, rol, uid, sexo }) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.rol = rol;
        this.uid = uid;
        this.sexo = sexo;


        //campos vacios que se completaran luego
        this.peso = 0;
        this.altura = 0;
        this.alergias = "";
        this.medicamentos = "";
        this.enfermedades = "";
        this.fumador = "";
    }
    completarDatos({ peso, altura, alergias, medicamentos, enfermedades, fumador }) {
        this.peso = peso;
        this.altura = altura;
        this.alergias = alergias;
        this.medicamentos = medicamentos;
        this.enfermedades = enfermedades;
        this.fumador = fumador;
    }
    toPlainObject() {
        return {
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            fechaNacimiento: this.fechaNacimiento,
            rol: this.rol,
            uid: this.uid,
            sexo: this.sexo,
            peso: this.peso,
            altura: this.altura,
            alergias: this.alergias,
            medicamentos: this.medicamentos,
            enfermedades: this.enfermedades,
            fumador: this.fumador
        };
    }
}
export class Medico {
    constructor({ nombre, apellido, email, fechaNacimiento, rol, uid, sexo }) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.rol = rol;
        this.uid = uid;
        this.sexo = sexo;


        //campos vacios que se completaran luego
        this.especialidad = "";
        this.colegiado = "";
    }
    completarDatos({ especialidad, colegiado }) {

        this.colegiado = colegiado;
        this.especialidad = especialidad;
    }
    toPlainObject() {
        return {
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            fechaNacimiento: this.fechaNacimiento,
            rol: this.rol,
            uid: this.uid,
            sexo: this.sexo,
            colegiado: this.colegiado,
            especialidad: this.especialidad,
        };
    }
}
