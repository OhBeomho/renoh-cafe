import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "./StyledComponents";

export default function () {
  const { loggedUser } = useAuth();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  return (
    <Navbar>
      <Link to="/" className="brand">
        Renoh Cafe
      </Link>
      <SearchSection>
        <b>카페 검색</b>
        &nbsp;
        <Input placeholder="검색어 입력" onChange={(e) => setSearchText(e.target.value)} />
        &nbsp;
        <Button type="button" onClick={() => searchText && navigate("/search?st=" + searchText)}>
          검색
        </Button>
      </SearchSection>
      {loggedUser ? (
        <div>
          <Link to="/profile">내 프로필</Link>
          <Link to="/cafe/create">카페 만들기</Link>
          <Link to="/logout">로그아웃</Link>
        </div>
      ) : (
        <div>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      )}
    </Navbar>
  );
}

const Navbar = styled.nav`
  position: relative;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.2);

  & .brand {
    color: black;
    font-size: 28px;
  }

  & a {
    margin: 0 5px;
  }
`;

const SearchSection = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
`;
