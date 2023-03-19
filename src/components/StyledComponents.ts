import styled from "styled-components";

export const Input = styled.input`
  border: 0;
  border-bottom: 1.5px solid rgb(50, 50, 50);
  outline: none;
  min-width: 200px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 1.5px 0 0 rgba(0, 0, 0, 0.6);
  }

  &:focus {
    box-shadow: 0 1.5px 0 0 rgb(50, 50, 50);
  }

  &:placeholder-shown {
    text-overflow: ellipsis;
  }
`;

export const Button = styled.button`
  border: 0;
  background-color: rgb(200, 200, 200);
  margin: 5px;
  padding: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: rgb(50, 50, 50);
    color: white;
  }
`;

export const Textarea = styled.textarea`
  border: 1.5px solid rgb(50, 50, 50);
  outline: none;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.6);
  }

  &:focus {
    box-shadow: 0 0 0 1.5px rgb(50, 50, 50);
  }
`;
