import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

export default function ({ children }: PropsWithChildren<{}>) {
  return (
    <Wrapper>
      <header>
        <Navbar></Navbar>
      </header>
      <Main>{children}</Main>
      <Footer>
        <p>
          Made by <a href="https://github.com/OhBeomho">OhBeomho</a>
        </p>
        <p>
          Source on <a href="https://github.com/OhBeomho/renoh-cafe">GitHub</a>
        </p>
      </Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90vw;
  max-width: 600px;
  margin: auto;
`;

const Footer = styled.footer`
  background-color: lightgray;
  text-align: center;
`;
