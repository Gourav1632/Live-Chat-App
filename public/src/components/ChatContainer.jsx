import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import Logout from './Logout';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { sendMessageRoute } from '../utils/APIRoutes';
import { recieveMessageRoute } from '../utils/APIRoutes';
import axios from 'axios';

export default function ChatContainer(props) {

    const [messages,setMessages] = useState([]);
    useEffect(()=>{
        async function fetchChat(){
            const response = await axios.post(recieveMessageRoute,{
                from: props.currentUser._id,
                to: props.currentChat._id,
            })
            setMessages(response.data);
        }
        fetchChat();
    },[props.currentChat])

    async function handleSendMsg(msg){
        await axios.post(sendMessageRoute,{
            from: props.currentUser._id,
            to: props.currentChat._id,
            message:msg,
        })
    }
  return (
    <Container>
        <div className='chat-header'>
            <div className="user-details">
                <div className="avatar"> 
                    <img src={`data:image/svg+xml;base64,${props.currentChat.avatarImage}`} alt="avatar" />
                </div>
                <div className="username">
                    <h3>{props.currentChat.username}</h3>
                </div>
            </div>
            <Logout />
        </div>
        {/* <Messages /> */}
        <div className="chat-messages">
            {
                messages.map((message)=>{
                    return(
                        <div>
                            <div className={`message ${message.fromSelf ?"sended" : "recieved"}`}>
                                <div className="content">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 78% 12% ;
    gap: 0.1rem;
    overflow: hidden;
    padding-top: 1rem;
    @media screen and  (min-width: 720px) and (max-width:1080px){
        grid-auto-rows: 15% 70% 15%;
    }
    .chat-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details{
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar{
                img{
                   height : 3rem ;
                }
            }
            .username{
                h3{
                    color: white;
                }
            }
        }

    }
    .chat-messages{
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        .message{
            display: flex;
            align-items: center;
            .content{
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;

            }
        }
        .sended{
            justify-content: flex-end;
            .content{
                background-color: #4f04ff21;
                
            }
        }
        .recieved{
           justify-content : flex-start ;
           .content{
            background-color: #9900ff20;
           }
        }
    }
`;