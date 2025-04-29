import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styled from 'styled-components';



const Back = (props) => {

  return (
    <BackButton onClick={props.onClick} >
      <FaArrowLeft style={{ marginRight: '8px' }} />
    </BackButton>
  );
};

const BackButton = styled.button`
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
svg{
  font-size: 1.3rem;
}
`;

export default Back;