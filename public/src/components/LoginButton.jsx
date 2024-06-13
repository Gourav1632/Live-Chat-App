import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';

export default function LoginButton(props) {
    const navigate = useNavigate();
    async function handleClick(){
        navigate("/login");
    }
  return (
    <Button onClick={handleClick}>
        Login
    </Button>
  )
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