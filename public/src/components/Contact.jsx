import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import Search from './Search'; 
import Ellipsis from './Ellipsis';
import AvatarPopup from './AvatarPopup';

function Contact(props) {
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessageIds,setNewMessageIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupAvatar, setPopupAvatar] = useState(null);
    const [isCurrentUser,setIsCurrentUser] = useState(false);

    function changeCurrentChat(index, contact) {
        setSearchQuery('');
        setCurrentSelected(index);
        props.changeChat(contact);
        setNewMessageIds((prev) => prev.filter(id => id !== contact._id));
    }
    function openPopup(avatar, e,isCurrentUser) {
      e.stopPropagation();
      setPopupAvatar(avatar);
      setShowPopup(true);
      setIsCurrentUser(isCurrentUser);
  
    }  
    function closePopup() {
      setShowPopup(false);
    }

    useEffect(()=>{
      if(props.socket.current){
          props.socket.current.on("recieve-new-message",(contactId)=>{
              setNewMessageIds((prev) => [...prev, contactId]);
            }
          )
      }
  },[props.socket,currentSelected])

    const filteredContacts = props.userContacts.filter(contact =>
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function hasNewMessage(contactId) {
      return newMessageIds.includes(contactId);
    }

    return (
        <>
            {props.currentUser.avatarImage && props.currentUser.username && (
                <Container>
                    <div className="ellipsis">
                      <Ellipsis socket={props.socket} currentUser={props.currentUser._id} />
                    </div>
                    <div className="current-user">
                        <div className="avatar" onClick={(e) => openPopup(props.currentUser.avatarImage,e,true)}>
                            <img
                                src={props.currentUser.avatarImage}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{props.currentUser.username}</h2>
                        </div>
                        <div className="add-friend">
                          <button onClick={props.addFriends}>Add Friend</button>
                        </div>
                    </div>
                    <div className='search'>
                        <Search setSearchQuery={setSearchQuery} />
                    </div>
                    <div className="contacts">
                        <div className="chat-heading">
                            <h2>Chats</h2>
                        </div>
                        {filteredContacts.length === 0 ? (
                            <div className="no-friends">
                                <p>Looks like there is nothing!</p>
                            </div>
                        ) : (
                            filteredContacts.map((contact, index) => (
                                <div
                                    key={index}
                                    className={`contact ${index === currentSelected ? "selected" : ""}`}
                                    onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="avatar" onClick={(e) => openPopup(contact.avatarImage,e,false)}>
                                        <img
                                            src={contact.avatarImage}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                        {hasNewMessage(contact._id) && (
                                            <div className="notify">New message</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        <div style={{ paddingBottom: '4rem', height: '4rem' }}></div>
                    </div>
                    {showPopup && <AvatarPopup isCurrentUser={isCurrentUser} avatarImage={popupAvatar} onClose={closePopup} onChangeProfile={props.onChangeProfile} />}
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
  color: white;
  display: grid;
  grid-template-rows: 15% 5% 80%;
  background-color: #181818;
  overflow: hidden;
  position: relative;
  gap: 1rem;
  .ellipsis{
    position: absolute;
    top: 1rem;
    right: 0.8rem;
  }
  .current-user {
    display: flex;
    overflow: visible;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #292a2a;
    .avatar {
      height: 4rem;
      width: 4rem;
      overflow: hidden;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      img {
        height: 4rem;
        width: 100%;
        object-fit: cover;
      }
    }
    .add-friend {
      button {
        width: 6rem;
        height: 2rem;
        border-radius: 3rem;
        border: none;
        background-color: #ffdf00;
        color: black;
        font-weight: bolder;
        &:hover {
          background-color: #9e8c1a;
        }
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.1rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .chat-heading {
      width: 93%;
      text-align: left;
      font-size: 1.5rem;
      margin: 0.5rem 0rem;
    }
    .contact {
      position: relative;
      min-height: 5rem;
      cursor: pointer;
      width: 93%;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      border-radius: 0.5rem;
      &:hover {
        background-color: #ffffff43;
      }
      .avatar {
        height: 3rem;
        width: 3rem;
        overflow: hidden;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        img {
          height: 3rem;
          width: 100%;
        object-fit: cover;
        }
      }
      .username {
        display: flex;
        flex-direction: column;
      }
    }
    .selected {
      background-color: #037ade;
    }
  }
  .no-friends {
    margin-top: 1rem;
    color: #ffffff;
    text-align: center;
  }
`;

export default Contact;
