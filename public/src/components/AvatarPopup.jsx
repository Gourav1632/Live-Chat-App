import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';



function AvatarPopup({ avatarImage, onClose, isCurrentUser }) {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  function handleClick(){
    navigate("/setAvatar");
  }

  return (
    <PopupContainer $isVisible={isVisible}>
      <div className="popup" ref={popupRef}>
        <img src={avatarImage} alt="avatar" />
        {isCurrentUser && (
          <button onClick={handleClick}>Edit</button>
        )}
      </div>
    </PopupContainer>
  );
}

const popUpAnimation = keyframes`
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  transition: background 0.3s ease-in-out;

  .popup {
    animation: ${popUpAnimation} 0.3s ease-in-out;
    opacity: ${( prop ) => (prop.$isVisible ? '1' : '0')};
    transition: opacity 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    padding: 1rem;
    text-align: center;
    img {
      max-width: 100%;
      height: 12rem;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem 2rem;
      border: none;
      background-color: #007bff;
      color: white;
      border-radius: 1rem;
      cursor: pointer;
      &:first-child {
        margin-right: 1rem;
      }
    }
  }
`;



export default AvatarPopup;
