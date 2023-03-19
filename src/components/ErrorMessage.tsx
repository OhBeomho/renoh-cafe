import React, { PropsWithChildren } from "react";
import styled from "styled-components";

export default function ({ children }: PropsWithChildren<{}>) {
  return (
    <Wrapper>
      <h2>Error</h2>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  color: rgb(200, 0, 0);
  text-align: center;
`;
