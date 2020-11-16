import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from './InfoBar';
import Input from './Input';
import Messages from './Messages';
import TextContainer from './TextContainer';
import '../index.css';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState('');
    const history = useHistory();

    const socketUrl = 'https://chatapp-in.herokuapp.com/';

    useEffect (() => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room);

        socket = io(socketUrl,{transports: ['websocket', 'polling', 'flashsocket']});
        socket.emit('USER_ADDED', { name, room }, (err) => {
            if (err) {
                alert(err);
                history.push('/');
            }
        });

        return () => {
            socket.emit('disconnected');
            //socket.off();
        }
    }, [socketUrl, location.search]);

    useEffect (() => {
        socket.on('MESSAGE', (message) => {
            setMessages([...messages, message]);
        });

        socket.on('ROOM_DATA', ({users}) => {
            setUsers(users);
        })
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit('NEW_MESSAGE', message, () => setMessage(''));
        }
    }

    console.log(messages);

    return (
        <div className = "outerContainer">
            <div className = "container">
                <InfoBar room = {room}/>
                <Messages messages = {messages} name = {name}/>
                <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage} />
            </div>
            <TextContainer users = {users} />
        </div>
    );
}

export default Chat;