import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server as SocketServer} from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

const io = new SocketServer(server);

app.use(cors());
app.use(morgan('dev'));


//Espacio en memoria para almacenar los mensajes.
let mensajes = [];


//Get para renderizar el index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});    

//Get para obtener los mensajes del chat.
app.get('/historial', (req, res)=>{
    console.log(mensajes)
    res.json(mensajes)
});


//Socket para la conexion de los usuarios.
io.on('connection', (socket) => {
    console.log('Un usuario se conecto');


    //Se escucha el evento msg.
    socket.on('msg', (msg)=> {

        //Se guarda el mensaje en el array.
        mensajes.push(msg);
        
        //Se emite el evento msg a todos los usuarios.
        socket.broadcast.emit('msg', msg);
    })


    //Se escucha el evento typing.
    socket.on('typing', (data) => {
        
        //Se emite el evento typing a todos los usuarios con el username que esta escribiendo.
        socket.broadcast.emit('typing', data);
    })


    //Se escucha el evento stopTyping.
    socket.on('stopTyping', () => {

        //Se emite el evento stopTyping a todos los usuarios.
        socket.broadcast.emit('stopTyping');
    })
  });


server.listen(3000, () => console.log('Running on port 3000'));