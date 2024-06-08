import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";



const Back = () => {
    const navigate = useNavigate();
    async function goBack(){
      navigate(-2);
    }
  return (
    <BackButton onClick={goBack}>
      <FaArrowLeft style={{ marginRight: '8px' }} />
    </BackButton>
  );
};

const BackButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 20px;
  background: none;
  border: none;
  color: inherit; /* Inherits the text color from the parent */
  cursor: pointer;
  padding: 0;
  outline: none;

  &:hover {
    color: #007bff; /* Change color on hover, optional */
  }
`;

export default Back;