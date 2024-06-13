import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import Logo from "../assets/chat.png"
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
      <div className="left">
      <div className="logo">
        <img src={Logo} alt="" />
        <h1>Ember</h1>
      </div>
        <div className="content">
            <div className="left-message">
                <h2> <span>Whenever,</span> Wherever...</h2>
            </div>
            <div className="right-message">
              <h2><span>Type your message...</span></h2>
            </div>
        </div>
      <div className="buttons">
        <LoginButton onClick={onclick} />
        <RegisterButton onClick={onclick} />
      </div>
      </div>
      <div className="right">
        <img src={ChatImg} alt="" />
      </div>
    </Container>
  );
}
const Container = styled.div`
display: flex;
align-items: center;
justify-content: center;
height: 100vh;
width: 100vw;
background-color: #181818;
gap: 5rem;
.left{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  .logo{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    img{
      height: 5rem;
    }
    h1{
      color: white;
      font-size: 4rem;
    }
  }
  .content{
    display: flex;
    flex-direction: column;
    align-items: center;
    .left-message{
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border-radius: 5rem 5rem 5rem 0;
      width: 25rem;
      height: 5rem;
      color: black;
      margin: 1rem;
      transform: translate(-3rem,0);

      span{
        color: #ffdf00;
      }
    }
    .right-message{
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #037ade;
      border-radius: 5rem 5rem 0 5rem;
      width: 25rem;
      height: 5rem;
      color: white;
      margin: 1rem;
      transform: translate(3rem,0);
      overflow: hidden;
      span{
        position: relative;
      }
      span::after{
        content: "";
        width: 100%;
        height: 100%;
        left: 0;
        position: absolute;
        background-color: #037ade;
        border-left: 3px solid white;
        z-index: 1;
        animation: typing 3s steps(10) infinite;
      }
      @keyframes typing {
        40%,
        60%{
          left: calc(100% + 1px);
        }
        100%{
          left: 0;
        }
      }
    }
  }
  .buttons{
    display: flex;
    align-content: center;
    justify-content: center;
    gap: 3rem;
    height: 3rem;
    width: 20rem;
  }
}
.right{
  img{
    height: 35rem;
  }
}
@media (max-width: 1080px) {
  .right{
    display: none;
  }
}
@media (max-width: 480px) {
  .right{
    display: none;
  }
  .left{
    .logo{
      gap: 1rem;
      img{
        height: 4rem;
      }
      h1{
        font-size: 3rem;
      }
    }
  .content{
    width: 90%;
    font-size: 0.7rem;
    .left-message{
      width: 15rem;
      height: 3rem;
    }
    .right-message{
      width: 15rem;
      height: 3rem;
    }
  }
  .buttons{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 18rem;
  }
}
}
`;

export default Home;
