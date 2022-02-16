const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios();

//cuando un usuario se conecta
io.on('connection', (client) => {

    //funcion cuando un usuario se conecta a la sala de chat
    client.on('entrarChat', (data, callback) => {

        console.log(data);

        //si no viene el nombre en la data
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'EL nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        //ejecutamos la accion de agregarPersona pasandole el id del cliente y nombre
        usuarios.agregarPersona( client.id, data.nombre, data.sala );

        //emitimos a todos los usuarios y mostramos todoas las personas del chat cuando alguien se conecte 
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala) );
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio al chat` ));

        //retornamos esto
        callback(usuarios.getPersonasPorSala(data.sala));
    })

    //al escuchar la funcion para mandar un mensaje invocamos a la funcion y le pasamos los valores
    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id)
        
        let mensaje = crearMensaje( persona.nombre, data.mensaje );
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        
        callback(mensaje);
    })


    //funcion cuando un usuario se desconecta
    client.on('disconnect', () => {
        
        //llamamos la funcion de borrar personas de la estructura de los usuarios
        let personaBorrada = usuarios.borrarPersona(client.id);

        //avisamos a todos los de la sala de chat
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat` ));

        //emitimos a todos los usuarios y mostramos todoas las personas del chat cuando alguien se conecte 
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala) );
    });

    //funcion para mensjaes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona( client.id );
        
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje( persona.nombre ,  data.mensaje));
    });


});