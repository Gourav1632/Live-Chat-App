import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Search from './Search';
import axios from 'axios';
import { sendRequestRoute, getCurrentUserRequestsRoute } from '../utils/APIRoutes';
import Back from './Back';

function AddFriends(props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sentRequests, setSentRequests] = useState([]);

    const filteredContacts = useMemo(() => {
        return props.contacts.filter(contact =>
            contact.username.toLowerCase().includes(searchQuery.toLowerCase())
            && !props.userContacts.some(userContact => userContact._id === contact._id)
        );
    }, [props.contacts, props.userContacts, searchQuery]);

    useEffect(() => {
        getCurrentUserRequests();
    }, []);

    async function handleSendRequest(contactId) {
        try {
            const response = await axios.post(`${sendRequestRoute}/${props.currentUser._id}`, { contactId });
            console.log("Friend request sent successfully!");
            props.socket.current.emit("send-request", {
                to: contactId,
                from: props.currentUser._id,
            })
            getCurrentUserRequests();
        } catch (error) {
            console.error("Failed to send friend request:", error);
        }
    }

    async function getCurrentUserRequests() {
        const data = await axios.get(`${getCurrentUserRequestsRoute}/${props.currentUser._id}`)
        setSentRequests(data.data);
    }

    function isRequestSent(contactId) {
        return sentRequests.some(request => request._id === contactId);
    }

    return (
        <Container>
            <div className="head">
                <div className="back">
                    <Back onClick={props.onBack} />
                </div>
                <div className='search'>
                    <Search setSearchQuery={setSearchQuery} />
                </div>
            </div>
            <div className="contacts">
                <div className="chat-heading">
                    <h2>Users</h2>
                </div>
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, index) => (
                        <div key={index} className="contact">
                            <div className="user-details">
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
                            <div className="send-request">
                                <button
                                    className={isRequestSent(contact._id) ? 'requested' : 'add'}
                                    disabled={isRequestSent(contact._id)}
                                    onClick={() => { handleSendRequest(contact._id) }}
                                >
                                    {isRequestSent(contact._id) ? 'Requested' : 'Add'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="nothing-found">
                        <p>Nothing found!</p>
                    </div>
                )}
                <div style={{ paddingBottom: '4rem', height: '4rem' }}></div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #181818;
    color: white;

    .head {
        display: flex;
        align-items: center;
        padding: 1rem 2rem;
    }

    .back {
        margin-right: 1rem;
    }

    .search {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem;
        width: 100%;
    }

    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        gap: 0.1rem;
        height: 90vh;

        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }

        .nothing-found {
            font-size: 2rem;
        }

        .chat-heading {
            width: 93%;
            text-align: left;
            font-size: 1.5rem;
            margin: 0.5rem 0rem;
        }

        .contact {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 93%;

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

            .send-request {
                .add {
                    width: 6rem;
                    height: 3rem;
                    border-radius: 3rem;
                    border: none;
                    background-color: #ffdf00;
                    color: black;
                    font-weight: bolder;

                    &:hover {
                        background-color: #9e8c1a;
                    }
                }

                .requested {
                    width: 6rem;
                    height: 3rem;
                    border-radius: 3rem;
                    border: 1px solid #ffdf00;
                    background-color: transparent;
                    color: white;
                    font-weight: bolder;
                }
            }
        }
    }

    @media screen and (min-width: 360px) and (max-width: 480px) {
        .head .back {
            display: none;
        }

        .head {
            padding: 1rem 5rem;
        }
    }
`;

export default AddFriends;
