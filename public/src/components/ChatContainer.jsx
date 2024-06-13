import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import { sendMessageRoute, recieveMessageRoute } from '../utils/APIRoutes';
import axios from 'axios';

export default function ChatContainer(props) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function fetchChat() {
            if (props.currentChat) {
                const response = await axios.post(recieveMessageRoute, {
                    from: props.currentUser._id,
                    to: props.currentChat._id,
                });
                setMessages(response.data);
            }
        }
        fetchChat();
    }, [props.currentChat]);

    useEffect(() => {
        if (props.socket.current) {
            props.socket.current.on('msg-recieve', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
            props.socket.current.emit("isOnline", props.currentChat._id);
            props.socket.current.on("onlineStatus", ({ userId, isOnline }) => {
                    setIsOnline(isOnline);
                    console.log(isOnline);
            });
        }
    }, [props.socket, props.currentChat]);

    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [arrivalMessage]);

    async function handleSendMsg(msg) {
        await axios.post(sendMessageRoute, {
            from: props.currentUser._id,
            to: props.currentChat._id,
            message: msg,
        });
        props.socket.current.emit('send-msg', {
            to: props.currentChat._id,
            from: props.currentUser._id,
            message: msg,
        });
        const updatedMessages = [...messages, { fromSelf: true, message: msg }];
        setMessages(updatedMessages);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    return (
        <Container>
            <div className='chat-header'>
                {/* Header content */}
            </div>
            <div className='chat-messages'>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.fromSelf ? 'sent' : 'received'}`}>
                        <div className='content'>
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;   
    display: grid;
    grid-template-rows: 10% 82% 8%;
    gap: 0.1rem;
    overflow: hidden;
    background-image: url('https://www.transparenttextures.com/patterns/cartographer.png');

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        color: white;
        border-bottom: 1px solid #686d76;
        background-color: #181818;
        .left {
            display: flex;
        }
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            justify-content: center;
            .avatar {
                height: 2.5rem;
                width: 2.5rem;
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                justify-content: center;
                img {
                    height: 2.5rem;
                }
            }
            .user{
                display: flex;
                flex-direction: column;
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message {
            display: flex;
            align-items: center;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.8rem;
                color: white;
            }
        }
        .sended {
            justify-content: flex-end;
            .content {
                border-radius: 1rem 0 1rem 1rem;
                background-color: #037ade;
            }
        }
        .recieved {
            justify-content: flex-start;
            .content {
                color: black;
                border-radius: 0rem 1rem 1rem 1rem;
                background-color: white;
            }
        }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-auto-rows: 15% 70% 15%;
        .chat-messages .message .content {
        font-size: 1rem;
    }
    }
    @media screen and (min-width: 360px) and (max-width: 480px) {
        grid-auto-rows: 15% 70% 15%;
    .chat-header .left {
        margin-top: 1rem;
        margin-left: 3rem; /* Adjust margin-left */
    }
    .chat-header .left .back {
        display: none;
    }
    .chat-messages .message .content {
        font-size: 1rem;
    }
    .button-container .emoji {
        padding: 0.5rem;
    }
}

`;
