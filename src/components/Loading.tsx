import React from "react";
import styled, { keyframes } from "styled-components";

export default function () {
  return (
    <Wrapper>
      <Circle></Circle>
      <Text>Loading...</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
`;

const CircleAnimation = keyframes`
  from {
    rotate: 0;
  }
  to {
    rotate: 360deg;
  }
`;

const Circle = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 12px solid rgb(50, 50, 50);
  border-top-color: transparent;
  border-radius: 100%;
  animation: ${CircleAnimation} 1s infinite linear;
`;

const Text = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 15px;
`;
