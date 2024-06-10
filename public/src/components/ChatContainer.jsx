import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { sendMessageRoute, recieveMessageRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Back from './Back';

export default function ChatContainer(props) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const scrollRef = useRef();

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
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    }

    useEffect(() => {
        if (props.socket.current) {
            props.socket.current.on('msg-recieve', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
            props.socket.current.emit("isOnline", props.currentChat._id);
            props.socket.current.on("onlineStatus", ({ userId, isOnline }) => {
                    setIsOnline(isOnline);
            });

        }
    }, [props.socket,props.currentChat]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Container>
            <div className='chat-header'>
                <div className='left'>
                    <Back onClick={props.onBack} />
                    <div className='user-details'>
                        <div className='avatar'>
                            <img src={props.currentChat.avatarImage} alt='avatar' />
                        </div>
                        <div className="user">
                            <div className='username'>
                                <h3>{props.currentChat.username}</h3>
                            </div>
                            {isOnline ? <div>Online</div> : <div>Offline</div>}
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <Logout className='logout' />
                </div>
            </div>
            <div className='chat-messages'>
                {messages.map((message, index) => (
                    <div ref={scrollRef} key={uuidv4()}>
                        <div className={`message ${message.fromSelf ? 'sended' : 'recieved'}`}>
                            <div className='content'>
                                <p>{message.message}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 82% 8%;
    gap: 0.1rem;
    overflow: hidden;
    background-image: url('https://www.transparenttextures.com/patterns/cartographer.png');
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-auto-rows: 15% 70% 15%;
    }
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
                img {
                    height: 2.5rem;
                }
            }
            .user{
                display: flex;
                flex-direction: column;
            }
        }
        .logout {
            align-items: flex-end;
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
                background-color: #00baba;
                background: linear-gradient(45deg, #037ade, #03e5b7);
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
`;
