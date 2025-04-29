import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { registerRoute } from '../utils/APIRoutes';
import axios from 'axios';
import {  toast } from "react-toastify";

export default function TryGuestButton(props) {
    const navigate = useNavigate();
    
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    
    const handleClick = async (event) => {
        event.preventDefault();

        try {
            const guestUsername = `guest_${Date.now()}`;
            const guestEmail = `${guestUsername}@chatapp.com`;

            const { data } = await axios.post(registerRoute, {
                username: guestUsername,
                email: guestEmail,
                password: "guestpassword123", 
                avatarImage: "https://firebasestorage.googleapis.com/v0/b/ember-chat-app-fbd3f.appspot.com/o/emberProfiles%2F0ba69dbc-7df2-4021-86be-53238d563662?alt=media&token=88a9cbb2-4366-4c80-81c7-488ae3c4c609" // Default avatar image
            });

            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            } else if (data.status === true) {
                const userData = { ...data.user, isGuest: true };
                localStorage.setItem("chat-app-user", JSON.stringify(userData)); 
                navigate("/chat"); 
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again later.", toastOptions);
        }
    }

    return (
        <Button onClick={handleClick}>
            Try as Guest
        </Button>
    );
}

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    width: 100%;
    border-radius: 5rem;
    background-color: #7FFFD4;
    font-size: 1.1rem;
    font-weight: bolder;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #097969;
    }
`;
