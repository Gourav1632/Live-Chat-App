import React, { useState, useRef, useEffect } from 'react';
import { MdMoreVert } from 'react-icons/md';
import styled from 'styled-components';
import Logout from './Logout';
import DeleteAccount from './DeleteAccount';

const Ellipsis = (props) => {
  const [isRotated, setIsRotated] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
      const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsRotated(false);
        setIsPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleClick = (event) => {
    event.stopPropagation();
    setIsRotated(!isRotated);
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <Container ref={popupRef}>
      <Button onClick={handleClick} $isRotated={isRotated}>
        <MdMoreVert />
      </Button>
      {isPopupVisible && (
        <div className="options">
            <div className="option"><DeleteAccount socket={props.socket}  currentUser={props.currentUser}/></div>
            <div className="option"><Logout socket={props.socket}/></div> 
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  .options{
  position: absolute;
  top: 88%;
  right: 0;
  width: 9rem;
  height: 6rem;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  }

 .option{
  background: none;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  animation: popUp .5s;
  transition: all .5s;

  @keyframes popUp {
    0% {
      opacity: 0;
      transform: translateY(-6px) scale(0);
    }
    50% {
      opacity: 0.5;
      transform: translateY(-4px) scale(1);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
 }

`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  padding: 0.5rem;
  border: none;
  color: white;
  cursor: pointer;
  outline: none;
  &:hover {
    color: #007bff;
  }
  svg {
    font-size: 2rem;
    transition: transform 0.3s;
    transform: ${({ $isRotated }) => ($isRotated ? 'rotate(90deg)' : 'rotate(0deg)')};
  }
`;



export default Ellipsis;
