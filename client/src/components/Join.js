import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className = "joinOuterContainer">
            <div className = "joinInnerContainer">
                <h1 className = "heading">Join a Room</h1>
                <div><input type = "text" placeholder = "Name.." className = "joinInput" onChange = {(e) => setName(e.target.value)} autoFocus/></div>
                <div><input type = "text" placeholder = "Room.." className = "joinInput mt-20" onChange = {(e) => setRoom(e.target.value)} /></div>
                <Link onClick = {(e) => (!name || !room) ? e.preventDefault() : null} to = {`/chat/?name=${name}&room=${room}`}>
                   <button className = "button mt-20" type = "submit">Sign In</button>
                </Link>
            </div>
        </div>
    );
}

export default Join;