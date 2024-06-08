    import React,{useState,useEffect} from 'react';
    import styled from 'styled-components';
    import Search from './Search';
    import axios from 'axios';
    import { sendRequestRoute , getCurrentUserRequestsRoute} from '../utils/APIRoutes';

    function AddFriends(props) {

        
        const [searchQuery, setSearchQuery] = useState('');
        const [sentRequests, setSentRequests] = useState([]);

        const filteredContacts = props.contacts.filter(contact =>
            contact.username.toLowerCase().includes(searchQuery.toLowerCase())
        );



        useEffect(()=>{
            getCurrentUserRequests();
        },[]);

        async function handleSendRequest(contactId) {
            try {
              const response = await axios.post(`${sendRequestRoute}/${props.currentUser._id}`, { contactId });
              console.log("Friend request sent successfully!");
              getCurrentUserRequests();
            } catch (error) {
              console.error("Failed to send friend request:", error);
              // Handle error
            }        
          }
          
        async function getCurrentUserRequests(){
            const data = await axios.get(`${getCurrentUserRequestsRoute}/${props.currentUser._id}`)
            setSentRequests(data.data);
        }
        function isRequestSent(contactId) {
            return sentRequests.some(request => request._id === contactId);
        }
    return (
        <Container>
            <div className='search'>
                <Search setSearchQuery={setSearchQuery} />
            </div>
            <div className="contacts">
                <div className="chat-heading">
                    <h2>Results</h2>
                </div>
            {filteredContacts.length === 0 ? (
                                <div className="no-friends">
                                    <p>Nothing found!</p>
                                </div>
                            ) : (
                                filteredContacts.map((contact, index) => (
                                    <div
                                        key={index}
                                        className="contact"
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
                                        <div className="send-request"> 
                                        <button disabled={isRequestSent(contact._id)} onClick={()=>{handleSendRequest(contact._id)}}>
                                            {isRequestSent(contact._id) ? 'Request Sent' : 'Send Request'}
                                        </button>
                                        </div>
                                    </div>
                                ))
                            )}
                            </div>
        </Container>
    );
    }

    const Container = styled.div`
    .search{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem;
    }
    .contacts {
        display: flex;
        color: white;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
        }}
    `;

    export default AddFriends;
