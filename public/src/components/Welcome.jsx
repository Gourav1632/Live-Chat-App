import React from 'react';
import styled from 'styled-components';
import Hello from '../assets/hello.gif';


function Welcome(props) {
  return (
    <Container>
        <img src={Hello} alt="" />
        <h1>Welcome, <span>{props.currentUser.username}</span></h1>
        <h3>Please select a chat to start messaging.</h3>
    </Container>
  )
}

const Container = styled.div`

display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
gap: 1rem;
img{
    height: 20rem;
}
span{
    color: #4e00ff;
}

`;

export default Welcome
