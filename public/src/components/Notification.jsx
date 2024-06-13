import React from 'react';
import styled from 'styled-components';
import { BiNotification } from 'react-icons/bi';
import { AiOutlineBell } from 'react-icons/ai';

export default function Notification(props) {

    return (
        <Button onClick={props.onClick}>
            <AiOutlineBell />
        </Button>
    );
}

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #037ADE;
    border: none;
    cursor: pointer;
    svg {
        font-size: 1.3rem;
        color: #ebe7ff;
    }
`;
