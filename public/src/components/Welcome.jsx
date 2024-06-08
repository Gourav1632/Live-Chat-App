import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Hello from '../assets/hello.gif';
import Notification from '../assets/notification.svg';
import Logout from './Logout';
import axios from 'axios';
import { acceptRequestRoute, getRecievedRequestsRoute, rejectRequestRoute } from '../utils/APIRoutes';

function Welcome(props) {
  const [receivedRequests, setReceivedRequests] = useState([]);

  async function getReceivedRequests() {
    const response = await axios.get(`${getRecievedRequestsRoute}/${props.currentUser._id}`);
    setReceivedRequests(response.data);
  }
  useEffect(() => {
    getReceivedRequests();
  }, [props.currentUser._id]);

  async function acceptRequest(contactId){
    try{
      await axios.post(`${acceptRequestRoute}/${props.currentUser._id}`,{contactId});
      console.log("Successfully accepted request.");
      setReceivedRequests(receivedRequests.filter(request => request._id !== contactId)); // Remove the accepted request from the list
      props.updateContacts();
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
          <div className='logout'>
            <Logout />
          </div>
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
        <div className='logout'>
          <Logout />
        </div>
          <h1>Friend Requests</h1>
            {
            receivedRequests.map((contact,index) => (
              <div key={index} className='contact'>
                <div className='avatar'>
                  <img src={contact.avatarImage} alt="avatar" />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
                <div className='send-request'>
                  <button onClick={()=>{acceptRequest(contact._id)}}>Accept</button>
                  <button onClick={()=>{rejectRequest(contact._id)}}>Reject</button>
                </div>
              </div>
            ))
            }
            </div>
      </Container>
    );
  }
}

const Container = styled.div`
  .welcome{
    height: 100%;
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
  }
  .notification{
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
          min-height: 5rem;
          cursor: pointer;
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
              img {
              height: 3rem;
              }
          }
        }
  }
`;


export default Welcome;
