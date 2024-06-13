import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { deleteuser } from '../utils/APIRoutes';

export default function DeleteAccount(props) {
    const [showPopup, setShowPopup] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleDeleteClick = () => {
        setShowPopup(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleConfirmDelete = async () => {
      console.log(props.currentUser);
        if (inputValue === 'delete') {
            try {
                const response = await axios.delete(`${deleteuser}/${props.currentUser}`);
                if (response.status === 200) {
                    console.log('deleted');
                    if (props.socket) {
                        props.socket.current.disconnect();
                    }
                    localStorage.clear();
                    setShowPopup(false);
                    navigate('/');
                } else {
                    alert('Failed to delete the account.');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete the account.');
            }
        } else {
            alert('Please type "delete" to confirm.');
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
        setInputValue('');
    };

    return (
        <div>
            <Button onClick={handleDeleteClick}>
                Delete Account
            </Button>
            {showPopup && (
                <PopupOverlay>
                    <Popup>
                        <h3>Type "delete" to confirm</h3>
                        <Input type="text" value={inputValue} onChange={handleInputChange} />
                        <ButtonGroup>
                            <PopupButton onClick={handleConfirmDelete}>Confirm</PopupButton>
                            <PopupButton onClick={handleCancel}>Cancel</PopupButton>
                        </ButtonGroup>
                    </Popup>
                </PopupOverlay>
            )}
        </div>
    );
}

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    width: 8rem;
    border-radius: 1rem;
    background-color: #ffdf00;
    font-weight: bolder;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: #9e8c1a;
    }
`;

const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Popup = styled.div`
    color: black;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
`;

const Input = styled.input`
    margin: 1rem 0;
    padding: 0.5rem;
    width: 100%;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-around;
`;

const PopupButton = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #ffdf00;
    cursor: pointer;
    &:hover {
        background-color: #9e8c1a;
    }
`;
