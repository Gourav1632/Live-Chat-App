import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import Logo from "../assets/logo.png"
import ChatImg from '../assets/chat.svg'


function Home() {
    const navigate = useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("chat-app-user")){
          navigate("/chat");
        }
      },[]);
  return (
    <Container>
      <div className="logo">
        <img src={Logo} alt="" />
        <h1>Ember</h1>
      </div>
        <div className="content">
            <div className="text">
                <h2>Whenever, Wherever...</h2>
                <h3>We're meant to be together...</h3>
            </div>
            <div className="img">
                <img src={ChatImg} alt="" />
            </div>
        </div>
      <div className="buttons">
        <LoginButton onClick={onclick} />
        <RegisterButton onClick={onclick} />
      </div>
    </Container>
  );
}
const Container = styled.div`
    display: grid;
    grid-template-rows: 16% 84%;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #181818;
    color: white;
  .logo{
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 2rem;
    img{
        height: 5rem;
        padding: 1rem
    }

  }
  .content{
    display: flex;
    align-items: center;
    justify-content: space-around;
    .text{
        h1{
            font-size: 4rem;
        }
        h2{
            font-size: 3rem;
        }
    }
    .img{
        img{
            height: 30rem;
        }
    }
  }

  .buttons{
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default Home;
