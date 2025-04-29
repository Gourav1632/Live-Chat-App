import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Notification from '../assets/notification.svg';
import axios from 'axios';
import { acceptRequestRoute, getRecievedRequestsRoute, rejectRequestRoute } from '../utils/APIRoutes';

function Welcome(props) {
  const [receivedRequests, setReceivedRequests] = useState([]);

  async function getReceivedRequests() {
    const response = await axios.get(`${getRecievedRequestsRoute}/${props.currentUser._id}`);
    setReceivedRequests(response.data);
  }
  useEffect(() => {
    if(props.socket.current){
      props.socket.current.on("recieve-request",(requestId)=>{
          getReceivedRequests(); 
      })
    }
    getReceivedRequests();
  }, [props.socket, props.currentUser._id]);

  async function acceptRequest(contactId){
    try{
      await axios.post(`${acceptRequestRoute}/${props.currentUser._id}`,{contactId});
      console.log("Successfully accepted request.");
      setReceivedRequests(receivedRequests.filter(request => request._id !== contactId));
      props.updateContacts();
      props.socket.current.emit("accept-request",{
        to: contactId,
        from: props.currentUser._id
    })    
    }catch(err){
      console.log("Failed to accept request: ",err);
    }
  }
  async function rejectRequest(contactId){
    try{
      await axios.post(`${rejectRequestRoute}/${props.currentUser._id}`,{contactId});
      console.log("Successfully rejected request.");
      setReceivedRequests(receivedRequests.filter(request => request._id !== contactId)); // Remove the rejected request from the list
      props.updateContacts();
    }catch(err){
      console.log("Failed to reject request: ",err);
    }
  }

  if (receivedRequests.length === 0) {
    return (
      <Container>
        <div className="welcome">
          <img src={Notification} alt="Notification" />
          <h1>Welcome, <span>{props.currentUser.username}</span></h1>
          <h3>You're all caught up! No new notifications</h3>
        </div>
      </Container>
    );
  } else {
    return (
      <Container>
        <div className="notification">
          <h1>Notifications</h1>
            {
            receivedRequests.map((contact,index) => (
              
                <div key={contact._id} className='contact'>
                  <div className="user-details">
                    <div className='avatar'>
                      <img src={contact.avatarImage} alt="avatar" />
                    </div>
                    <div className="username">
                      <h3>{contact.username}</h3>
                    </div>
                  </div>
                  <div className='request'>
                    <button className='accept' onClick={()=>{acceptRequest(contact._id)}}>Accept</button>
                    <button className='ignore' onClick={()=>{rejectRequest(contact._id)}}>Ignore</button>
                  </div>
                </div>
            ))
            }
            <div style={{ paddingBottom: '4rem', height: '4rem' }}></div>
            </div>
      </Container>
    );
  }
}


const Container = styled.div`
  height: 100%;
  .welcome {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    gap: 1rem;
    img {
      height: 30rem;
    }
    span {
      color: #037ADE;
    }
    h3 {
      text-align: center;
      padding: 1rem;
    }
  }
  .notification {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    gap: 1rem;
    .logout {
      position: fixed;
      top: 2rem;
      right: 2%;
      display: flex;
      align-items: center;
    }
    img {
      height: 40rem;
    }
    span {
      color: #037ADE;
    }
    .contact {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0rem 1rem;
      .user-details {
        min-height: 5rem;
        width: 93%;
        padding: 0.4rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        border-radius: 0.5rem;
        .avatar {
          height: 3rem;
          width: 3rem;
          overflow: hidden;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          img {
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
        }
      }
      .request {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        .accept {
          width: 6rem;
          height: 3rem;
          border-radius: 3rem;
          border: none;
          background-color: #7FFFD4;
          font-weight: bolder;
          &:hover {
            background-color: #097969;
          }
        }
        .ignore {
          width: 6rem;
          height: 3rem;
          border-radius: 3rem;
          border: none;
          background-color: #646463;
          color: white;
          font-weight: bolder;
          &:hover {
            background-color: #3d3d3d;
          }
        }
      }
    }
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    .welcome img {
      height: 20rem;
    }
    .notification .contact .request .accept {
      width: 5rem;
      height: 2rem;
    }
    .notification .contact .request .ignore {
      width: 5rem;
      height: 2rem;
    }
  }

  @media screen and (min-width: 360px) and (max-width: 480px) {
    .welcome img {
      height: 15rem;
    }
    .notification .contact .request .accept {
      width: 5rem;
      height: 2rem;
    }
    .notification .contact .request .ignore {
      width: 5rem;
      height: 2rem;
    }
  }
`;

export default Welcome;
