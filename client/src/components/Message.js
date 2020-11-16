import { React } from "react";
import '../index.css';
import ReactEmoji from 'react-emoji';

const Message = ({ message : { user, text }, name }) => {
    let isMessageSentByCurrentUser = false;
    let isSentByAdmin = false;
    const trimmedName = name.trim().toLowerCase();
    if (user === trimmedName) {
        isMessageSentByCurrentUser = true;
    }

    if (user === 'admin') {
        isSentByAdmin = true;
    }

    return (
         
            !isMessageSentByCurrentUser ? isSentByAdmin ? (
                <div>
                    <b><p style = {{textAlign: "center", color: "red"}}>{text}</p></b>
                </div>
            ) : (
                <div className = "messageContainer justifyStart">
                <p className = "sentText pl-10">{user}</p>
                <div className = "messageBox backgroundLight">
                    <p className = "messageText colorDark">{ReactEmoji.emojify(text)}</p>
                </div>
                </div>
            ) :(
                <div className = "messageContainer justifyEnd">
                <p className = "sentText pr-10">{name}</p>
                <div className = "messageBox backgroundBlue">
                    <p className = "messageText colorWhite">{ReactEmoji.emojify(text)}</p>
                </div>
                </div>
            )
    )
}

export default Message;