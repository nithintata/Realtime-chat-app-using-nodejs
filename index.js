const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const router = require('./router');
var path = require('path');
const cors = require('cors');
const { addUser, removeUser, getAllUsersInRoom, getUser} = require('./users');
const { use } = require('./router');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.use(router);
app.use(cors());


io.on('connection', (socket) => {
    console.log(`New user connected with id: ${socket.id}`);

    socket.on('USER_ADDED', ({ name, room }, callback) => {
        const { err, user } = addUser({ id: socket.id, name, room });
        if (err) {
            return callback(err);
        }

        socket.emit('MESSAGE', { user: 'admin', text: `Welcome to the room, ${user.name}!!`});
        socket.broadcast.to(user.room).emit('MESSAGE', { user: 'admin', text: `${user.name} has joined the chat!`});
        socket.join(user.room);

        io.to(user.room).emit('ROOM_DATA', { room: user.room, users: getAllUsersInRoom(user.room)});

        callback();
    });

    socket.on('NEW_MESSAGE', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('MESSAGE', { user: user.name, text: message});
        //io.to(user.room).emit('ROOM_DATA', { room: user.room, users: getAllUsersInRoom(user.room)});
        
        callback();
    })



    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        //console.log(`User with id ${user.id} has disconnected`);
        if (user) {
            io.to(user.room).emit('MESSAGE', { user: 'admin', text: `${user.name} has left the chat!`})
            io.to(user.room).emit('ROOM_DATA', { room: user.room, users: getAllUsersInRoom(user.room)});
        }
    });

    socket.on('disconnected', () => {
        const user = removeUser(socket.id);
        //console.log(`User with id ${user.id} has disconnected`);
        if (user) {
            io.to(user.room).emit('MESSAGE', { user: 'admin', text: `${user.name} has left the chat!`})
            io.to(user.room).emit('ROOM_DATA', { room: user.room, users: getAllUsersInRoom(user.room)});
        }
    })
});

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));