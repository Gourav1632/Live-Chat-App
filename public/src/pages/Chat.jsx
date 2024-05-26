import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { allUsersRoute } from '../utils/APIRoutes';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Contact from '../components/Contact';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';

function Chat() {
  const navigate = useNavigate();
  const [currentUser,setCurrentUser] = useState(undefined);
  const [contacts,setContacts] = useState([]);
  const [currentUserName,setCurrentUserName] = useState(undefined);
  const [currentUserImage,setCurrentUserImage] = useState(undefined);
  const [currentChat,setCurrentChat] = useState(undefined);
  const [isLoaded,setIsLoaded] = useState(false);


  useEffect(()=>{
    async function getCurrentUser(){
      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      }else{
        const data = await JSON.parse(localStorage.getItem("chat-app-user"));
        setCurrentUser(data)
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
        setIsLoaded(true);
      }
    }
    getCurrentUser();
},[]);

  
  useEffect(()=>{
    async function api(){
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          console.log(`${allUsersRoute}/${currentUser._id}`)
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }else{
          navigate("/setAvatar");
        }
      }
    }
    api();
  },[currentUser])

  function handleChatChange(chat){
    setCurrentChat(chat);
  }
  return (
    <>
    {
      
    !isLoaded?
    <Container>
    </Container>:
    (
    <Container>
      <div className="container">
        <Contact 
          contacts={contacts} 
          currentUser = {currentUser}
          changeChat={handleChatChange} 
        />
        {
          isLoaded && currentChat === undefined
          ?
          <Welcome currentUser={currentUser} />
          :
          <ChatContainer currentChat={currentChat} currentUser={currentUser} />
        }
      </div>

    </Container>)
  }
  </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and  (min-width: 720px) and (max-width:1080px){
      grid-template-columns: 35% 65%;
    }
    @media screen and  (min-width: 360px) and (max-width:480px){
      grid-template-columns: 35% 65%;
    }
  }

`;

export default Chat
