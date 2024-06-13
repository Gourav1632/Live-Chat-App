import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/chat.png"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import LoginImg from "../assets/Login.svg";

export default function Login() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  useEffect(()=>{
    if(localStorage.getItem("chat-app-user")){
      navigate("/chat");
    }
  },[]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, username} = values;
    if (username === "") {
      toast.error(
        "Username is required.",
        toastOptions
      );
      return false;
    } else if (password === "") {
      toast.error(
        "Password is required.",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const {username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if(data.status === true){
        localStorage.setItem("chat-app-user",JSON.stringify(data.user));
        navigate("/");
      }

    }
  }
  function goToHome(){
    navigate("/");
  }

  return (
    <>
      <FormContainer>
        <div className="formContainer">
        <img src={LoginImg} alt="" className="login-image" />
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand" onClick={goToHome}>
            <img src={Logo} alt="logo" className="logo"/>
            <h1>EMBER</h1>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Sign In</button>
          <span>
            Don't have an account ? <Link to="/register">Register</Link>
          </span> 
        </form>
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;

  .formContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    height: 40rem;
    width: 70rem;
    padding: 1rem;
    border-radius: 1rem;

    .login-image {
      height: 38rem;
      border-radius: 1rem;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-right: 10rem;

      .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        .logo {
          height: 4rem;
        }
      }

      input {
        padding: 0.5rem 0.8rem;
        font-size: 1.2rem;
        border: 0.2rem solid #dfecfd;
      }

      button {
        background-color: #86a0d3;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;

        &:hover {
          background-color: #0f114c;
        }
      }

      span {
        text-transform: uppercase;

        a {
          color: #0f114c;
          text-decoration: none;
          font-weight: bold;
        }
      }
    }
  }

  @media (max-width: 1080px) {
    .formContainer {
      flex-direction: column;
      height: auto;
      width: 90%;
      padding: 2rem;

      .login-image {
        height: 25rem;
      }

      form {
        margin-right: 0;
        width: 100%;

        .brand {

          .logo {
            height: 3rem;
          }
        }

        input {
          width: 100%;
          font-size: 1rem;
        }

        button {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
        }

        span {
          text-align: center;

          a {
            font-size: 1rem;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .formContainer {
      width: 90%;
      padding: 1rem;

      .login-image {
        height: 20rem;
      }

      form {
        gap: 0.5rem;

        .brand {
          gap: 0.5rem;

          h1 {
            font-size: 1.5rem;
          }
        }

        input {
          font-size: 0.9rem;
        }

        button {
          font-size: 0.9rem;
        }

        span {
          a {
            font-size: 0.9rem;
          }
        }
      }
    }
  }
`;
