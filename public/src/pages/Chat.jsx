import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { allUsersRoute, contactsRoute, host } from '../utils/APIRoutes';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contact from '../components/Contact';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";
import Search from '../components/Search';
import AddFriends from '../components/AddFriends';
import Notification from '../components/Notification';
import Logout from '../components/Logout';
import Back from '../components/Back';
import Ellipsis from '../components/Ellipsis';

function Chat() {

  const socket = useRef();

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [userContacts, setUserContacts] = useState([]);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [displayMainWindow, setDisplayMainWindow] = useState("none");
  const [showBackIcon, setShowBackIcon] = useState("none");
  const [showNotificationIcon,setShowNotificationIcon] = useState("block");
  const [gridRatio, setGridRatio] = useState("100% 0%");

  useEffect(() => {
    async function getCurrentUser() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        const data = await JSON.parse(localStorage.getItem("chat-app-user"));
        setCurrentUser(data)
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
        setIsLoaded(true);
      }
    }
    getCurrentUser();
  }, []);
  
  useEffect(() => {
    console.log(currentUserImage);  // This will now log after the state is updated
  }, [currentUserImage]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id)
    }
  
  }, [currentUser]);

  async function getUserContacts(){
    const usrData = await axios.get(`${contactsRoute}/${currentUser._id}`)
    setUserContacts(usrData.data);
  }

  useEffect(() => {
    if(socket.current){
      socket.current.on("request-accepted",(acceptor)=>{
        getUserContacts();
      });
    }
  }, [socket,currentUser]);


  useEffect(() => {
    async function api() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          const usrData = await axios.get(`${contactsRoute}/${currentUser._id}`)
          setContacts(data.data);
          setUserContacts(usrData.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    api();
  }, [currentUser])

  function handleChatChange(chat) {
    setShowAddFriends(false);
    setCurrentChat(chat);
    setGridRatio("0% 100%");
    setDisplayMainWindow("block");
    setShowNotificationIcon("none");
    setShowBackIcon("block");
  }
  function handleAddFriends() {
    setShowAddFriends(true);
    setGridRatio("0% 100%");
    setDisplayMainWindow("block");
    setShowNotificationIcon("none");
    setShowBackIcon("block")
  }
  async function updateContacts() {
    const response = await axios.get(`${contactsRoute}/${currentUser._id}`);
    setUserContacts(response.data);
  }

  function goToNotification() {
    setCurrentChat(undefined);
    setShowAddFriends(false);
    setGridRatio("0% 100%");
    setDisplayMainWindow("block");
    setShowNotificationIcon("none");
    setShowBackIcon("block")
  }
  function goToContacts(){
    setGridRatio("100% 0%");
    setDisplayMainWindow("none");
    setShowNotificationIcon("block");
    setShowBackIcon("none")
  }

  return (
    <>
      {
        !isLoaded ?
          <Container>
          </Container> :
          (
            <Container $showNotificationIcon={showNotificationIcon} $showBackIcon={showBackIcon} $displayMainWindow={displayMainWindow} $gridRatio={gridRatio}>
            <div className='notification-bell'>
              <Notification onClick={goToNotification} />
            </div>
            <div className="contact-icon">
              <Back onClick={goToContacts}/>
            </div>
              <div className="container">
                <Contact
                  contacts={contacts}
                  userContacts={userContacts}
                  currentUser={currentUser}
                  changeChat={handleChatChange}
                  addFriends={handleAddFriends}
                  socket={socket}
                />
            <div className="main-window">
                {showAddFriends ? (
                  <AddFriends currentUser={currentUser} userContacts={userContacts} contacts={contacts} socket={socket} onBack={()=>{setShowAddFriends(false)}}/>
                ) : isLoaded && currentChat === undefined ? (
                  <Welcome currentUser={currentUser} updateContacts={updateContacts} socket={socket} />
                ) : (
                  <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} onBack={()=>{setCurrentChat(undefined)}}/>
                )}
              </div>
            </div>

            </Container>
          )
      }
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #181818;

  @keyframes popUp {
    0% {
      transform: scale(0);
    }
    80% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .notification-bell {
    z-index: 1;
    display: none;
  }

  .contact-icon {
    display: none;
  }

  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 30% 70%;
    transition: all 0.5s;

    .main-window {
      height: 100%;
      width: 100%;
      transition: all 0.5s;
    }
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    .container {
      grid-template-columns: 50% 50%;
    }
  }

  @media screen and (min-width: 360px) and (max-width: 480px) {
    .container {
      grid-template-columns: ${(props) => props.$gridRatio};
      transition: all 0.5s;
    }
    .main-window {
      display: ${(props) => props.$displayMainWindow};
    }
    .notification-bell {
      position: fixed;
      top: 2rem;
      left: 2rem;
      display: ${(props) => props.$showNotificationIcon};
      animation: ${(props) => (props.$showNotificationIcon === "block" ? "popUp 0.5s" : "none")};
      transition: all 0.5s;
    }
    .contact-icon {
      position: fixed;
      top: 2rem;
      left: 2rem;
      display: ${(props) => props.$showBackIcon};
      animation: ${(props) => (props.$showBackIcon === "block" ? "popUp 0.5s" : "none")};
      transition: all 0.5s;
    }
  }
`;


export default Chat;
