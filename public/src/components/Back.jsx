import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";



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
  font-size: 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  outline: none;

  &:hover {
    color: #007bff; /* Change color on hover, optional */
  }
`;

export default Back;