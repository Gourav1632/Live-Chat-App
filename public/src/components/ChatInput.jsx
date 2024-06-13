import React,{useState,useRef,useEffect} from 'react'
import Picker from 'emoji-picker-react';
import styled from 'styled-components';
import {IoMdSend} from 'react-icons/io'
import {BsEmojiSmile} from 'react-icons/bs'

export default function ChatInput(props) {
    const [showEmojiPicker,setShowEmojiPicker]  = useState(false);
    const [msg, setMsg] = useState("");
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function handleEmojiPickerHideShow(){
        setShowEmojiPicker(!showEmojiPicker);
    }
    function handleEmojiClick(emoji){
        setMsg(prevMsg =>prevMsg + emoji.emoji);
    }
    function sendChat(event){
        event.preventDefault();
        if(msg.length>0){
            props.handleSendMsg(msg);
            setMsg('');
        }
    }
  return (
    <Container>
        <div className="button-container">
            <div className="emoji" ref={emojiPickerRef} >
                <BsEmojiSmile onClick={handleEmojiPickerHideShow} />
                {
                    showEmojiPicker && <Picker className='emoji-picker-react' onEmojiClick={handleEmojiClick} />
                }
            </div>
        </div>
        <form className='input-container' onSubmit={(e)=>sendChat(e)}>
            <input type="text" placeholder='Type a message' value={msg} onChange={(e)=>{setMsg(e.target.value)}}/>
            <button className='submit'>
                <IoMdSend />   
            </button>
        </form>
    </Container>
  )
}


const Container = styled.div`
display: grid;
grid-template-columns: 4% 96%;
align-items: center;
background-color: #242424;
padding:0 1rem;
padding-bottom: 0.3rem;
@media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
}
.button-container{
    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 3px;
    .emoji{
        width: 1rem;
        position: relative;
        padding: 1rem;
        svg{
            font-size: 1.5rem;
            color: white;
            cursor: pointer;
        }
        .emoji-picker-react {
        position: absolute;
        top: -470px;
    }
}
&:hover{
    background-color: #595959;
}
}
.input-container{
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2rem;
    input{
        color: white;
        width: 90%;
        height: 60%;
        background-color: transparent;
        border: none;
        padding-left: 1rem;
        font-size: 1.2rem;
        &::selection{
            background-color: #9a86f3;
        }
        &:focus{
           outline : none ;
        }
    }
    button{
        padding: 0.5rem;
        border-radius:  50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #037ADE;
        border: none;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            padding: 1rem 1rem;
            svg{
                font-size: 1rem;
            }
        }
        svg{
            font-size: 1.5rem;
            color: white;
        }
    }
}
@media screen and (min-width: 360px) and (max-width: 480px) {
    grid-template-columns: 10% 90%;
}

`;
