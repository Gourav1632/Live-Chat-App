import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import loader from "../assets/load.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";
import AddImage from "../assets/addImage.png";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const inputRef = useRef();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [customAvatar, setCustomAvatar] = useState(undefined);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    async function fetchImage() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        var image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        var buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    }
    fetchImage();
  }, []);

  async function setProfilePicture() {
    if (selectedAvatar === undefined && !isCustomSelected) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      let avatarImage;
  
      if (isCustomSelected && customAvatar) {
        const reader = new FileReader();
        reader.readAsDataURL(customAvatar);
        reader.onloadend = async () => {
          avatarImage = reader.result;
          const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatarImage,
          });
  
          if (data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem("chat-app-user", JSON.stringify(user));
            navigate("/");
          } else {
            toast.error("Error setting avatar. Please try again.", toastOptions);
          }
        };
      } else {
        avatarImage = isCustomSelected ? customAvatar : `data:image/svg+xml;base64,${avatars[selectedAvatar]}`;
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatarImage,
        });
  
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastOptions);
        }
      }
    }
  }
  

  function handleImageClick() {
    inputRef.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    setCustomAvatar(file);
    setIsCustomSelected(true);
    setSelectedAvatar(undefined);
  }

  function handleAvatarClick(index) {
    setSelectedAvatar(index);
    setIsCustomSelected(false);
    setCustomAvatar(undefined);
  }

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Choose your avatar!</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => handleAvatarClick(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                />
              </div>
            ))}
            <div
              className={`customAvatar avatar ${isCustomSelected ? "selected" : ""}`}
              onClick={handleImageClick}
            >
              {customAvatar ? (
                <img src={URL.createObjectURL(customAvatar)} alt="avatar" />
              ) : (
                <img src={AddImage} alt="avatar" />
              )}
              <input hidden type="file" ref={inputRef} onChange={handleImageChange} />
            </div>
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #6588cd;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    align-items: center;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .customAvatar{
      height: 6rem;
      width: 6rem;
      overflow: hidden;
      border-radius: 50%;
    }
    .selected {
      border: 0.4rem solid white;
    }
  }
  .submit-btn {
    background-color: #86A0D3;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #0F114C;
    }
  }
`;
