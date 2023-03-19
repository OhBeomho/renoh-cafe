import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { config } from "../config";

type Cafe = {
  _id: string;
  cafeName: string;
  members: any[];
  owner: { username: string };
};

export default function () {
  const [popular, setPopular] = useState<Cafe[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(`${config.API_URL}/cafe/popular`, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("서버에서 오류가 발생하였습니다.");
        }

        return res.json();
      })
      .then((data) => setPopular(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const popularElements = popular?.map((cafe, index) => (
    <CafeListItem key={index} onClick={() => navigate("/cafe/view/" + cafe._id)}>
      <div className="name">{cafe.cafeName}</div>
      <div>
        <span>{cafe.owner.username}</span>
        <span className="member-count">멤버 수: {cafe.members.length + 1}</span>
      </div>
    </CafeListItem>
  ));

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <ErrorMessage>{error}</ErrorMessage>
  ) : (
    <>
      <h1>Renoh Cafe</h1>
      <p>자신만의 카페를 만들어 사람들과 소통하세요.</p>
      <TitleWithLine>
        Popular <span className="sub">멤버가 많은 카페</span>
      </TitleWithLine>
      {popularElements?.length ? (
        <CafeList>{popularElements}</CafeList>
      ) : (
        <p style={{ color: "gray", margin: "4px 0" }}>카페가 없습니다.</p>
      )}
    </>
  );
}

const TitleWithLine = styled.h3`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 4px 0;
  margin-top: 60px;
  gap: 8px;

  & .sub {
    color: gray;
    font-size: 12px;
    font-weight: 300;
    align-self: flex-end;
  }

  &::before,
  &::after {
    content: "";
    height: 1.5px;
    background-color: rgb(50, 50, 50);
  }

  &::before {
    flex: 0.15;
  }

  &::after {
    flex: 2;
  }
`;

const CafeList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px;
  width: 100%;
`;

const CafeListItem = styled.li`
  margin: 0;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  user-select: none;

  & .name {
    font-weight: bold;
  }

  & .member-count {
    color: gray;
    margin-left: 5px;
  }

  &:hover {
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.4);
  }
`;
