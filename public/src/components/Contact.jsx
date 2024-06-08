import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from "../assets/logo.png";
import Search from './Search'; // Import the Search component

function Contact(props) {
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    function changeCurrentChat(index, contact) {
        setSearchQuery('');
        setCurrentSelected(index);
        props.changeChat(contact);
    }

    const filteredContacts = props.userContacts.filter(contact =>
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {props.currentUser.avatarImage && props.currentUser.username && (
                <Container>
                    <div className="current-user">
                        <div className="avatar">
                            <img
                                src={props.currentUser.avatarImage}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{props.currentUser.username}</h2>
                        </div>
                        <button onClick={props.addFriends}>Add Friend</button>
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
                                <p>Looks like you have no friends yet.</p>
                            </div>
                        ) : (
                            filteredContacts.map((contact, index) => (
                                <div
                                    key={index}
                                    className={`contact ${index === currentSelected ? "selected" : ""}`}
                                    onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="avatar">
                                        <img
                                            src={contact.avatarImage}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
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
  gap: 1rem;
  border-right: 1px solid #686D76;
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
      img {
        height: 4rem;
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
  .search{
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
    .chat-heading{
      width: 93%;
      text-align: left;
      font-size: 1.5rem;
      margin: 0.5rem 0rem;
    }
    .contact {
      min-height: 5rem;
      cursor: pointer;
      width: 93%;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      border-radius: 0.5rem;
      &:hover{
        background-color: #ffffff43;
      }
      .avatar {
        height: 3rem;
        width: 3rem;
        overflow: hidden;
        border-radius: 50%;
        img {
          height: 3rem;
        }
      }
    }
    .selected {
      background-color:  #037ADE;
    }
  }
  .no-friends {
    margin-top: 1rem;
    color: #ffffff;
    text-align: center;
  }
`;

export default Contact;
