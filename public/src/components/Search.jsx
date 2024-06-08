import React from 'react';
import styled from 'styled-components';

function Search({ setSearchQuery }) {
    function handleSearch(event) {
        setSearchQuery(event.target.value);
    }

    return (
        <Input
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
        />
    );
}

const Input = styled.input`
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
    font-size: 1rem;
    width: 100%;
    max-width: 20rem;
`;

export default Search;
