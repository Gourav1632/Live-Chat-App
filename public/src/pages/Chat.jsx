import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { allUsersRoute, contactsRoute, host } from '../utils/APIRoutes';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contact from '../components/Contact';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";
import Logo from "../assets/logo.png";
import Background from "../assets/background.jpg";
import Search from '../components/Search';
import AddFriends from '../components/AddFriends';

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
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id)
    }
  }, [currentUser]);



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
    setCurrentChat(chat);
  }
  function handleAddFriends() {
    setShowAddFriends(true);
  }
  async function updateContacts() {
    const response = await axios.get(`${contactsRoute}/${currentUser._id}`);
    setUserContacts(response.data);
  }
  return (
    <>
      {
        !isLoaded ?
          <Container>
          </Container> :
          (
            <Container>
              <div className="container">
                <Contact
                  contacts={contacts}
                  userContacts={userContacts}
                  currentUser={currentUser}
                  changeChat={handleChatChange}
                  addFriends={handleAddFriends}
                />
                {showAddFriends ? (
                  <AddFriends currentUser={currentUser} contacts={contacts}  />
                ) : isLoaded && currentChat === undefined ? (
                  <Welcome currentUser={currentUser} updateContacts={updateContacts} />
                ) : (
                  <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                )}
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
  .container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 30% 70%;
    @media screen and  (min-width: 720px) and (max-width:1080px){
      grid-template-columns: 35% 65%;
    }
    @media screen and  (min-width: 360px) and (max-width:480px){
      grid-template-columns: 35% 65%;
    }
  }

`;

export default Chat
