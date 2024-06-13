import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import loader from "../assets/load.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";
import AddImage from "../assets/addImage.png";
import { imgDB } from "../utils/firebase";
import {getDownloadURL,ref, uploadBytes} from "firebase/storage";
import { v4 } from "uuid";



export default function SetAvatar() {
  const navigate = useNavigate();
  const inputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [customAvatar, setCustomAvatar] = useState(undefined);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [profileURL,setProfileURL] = useState("");
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


  async function setProfilePicture() {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
    const img = ref(imgDB, `emberProfiles/${v4()}`);
  
    try {
      const data = await uploadBytes(img, customAvatar);
      const val = await getDownloadURL(data.ref);
      console.log(val);
      setProfileURL(val);
      if (val) {
        const response = await axios.post(`${setAvatarRoute}/${user._id}`, { image: val });
          user.isAvatarImageSet = true;
          user.avatarImage = val;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
       
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (error) {
      console.error("Error setting avatar:", error);
      toast.error("Error setting avatar. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
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
    flex-wrap: wrap;
    justify-content: center;
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
    .customAvatar {
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

  @media (min-width: 768px) {
    .avatars {
      flex-wrap: nowrap;
    }
  }
`;
