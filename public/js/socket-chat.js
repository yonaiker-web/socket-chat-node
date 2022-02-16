//archivo que trabaja toda la informacion de chat del lado del cliente

//usamos el socket.io
var socket = io();

//obtenemos datos por el url
//verificamos que alla algun nombre de usuario conectado en la sala de chat
var params = new URLSearchParams(window.location.search);

//si no viene ningun nombre y un id de sala en los parametros retornamos a index
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

//guardamos en usuario el nombre y la sala del usuario que se conecta
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

//funcion que se activa cada vez que alla una coneccion en el socket
socket.on('connect', function() {
    console.log('Conectado al servidor');

    //emitimos una accion llamad entrarChat
    socket.emit('entrarChat', usuario, function(resp){
        console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
    });
});

//funcion que se dispara cada vez que un usuario salga d ela sala del chat
// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


/* // Enviar información
socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});
 */

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    //console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom()

});


//escuchar cambios de usuarios
//cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log( personas);
    renderizarUsuarios(personas)

});

//funcion para mensjaes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado', mensaje);
})
