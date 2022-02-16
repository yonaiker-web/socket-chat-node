//archivo que genera la estructura del usaurio - server/socket/socket

//estructura de usuarios en el chat
class Usuarios {

    //arreglo de todas las personas de la sala de chat
    constructor() {
        this.personas = [];
    }

    //funcion para agregar una persona al chat
    agregarPersona(id, nombre, sala){

        let persona = {
            id,
            nombre,
            sala
        };

        //agregamos al arreglo de personas
        this.personas.push(persona);

        return this.personas;
    }

    //obtenemos un usuario por id en el arreglo de personas
    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    //obtenemos todos los usuarios en e chat
    getPersonas() {
        return this.personas;
    }

    //obtenemos las personas por salas
    getPersonasPorSala( sala ){
        let personaEnSala = this.personas.filter( persona => persona.sala === sala )
        return personaEnSala;
    }

    //borramos una persona de la sala de chat
    borrarPersona(id) {

        //obtenemos a la persona pasada por id
        let personaBorrada = this.getPersona(id);

        //guardamos a todas las personas del chat que sean diferente al id pasado
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}