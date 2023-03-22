import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { Button, Input } from "../components/StyledComponents";
import { config } from "../config";

type Cafe = {
  _id: string;
  cafeName: string;
  owner: { username: string };
};

export default function () {
  const location = useLocation();
  const navigate = useNavigate();
  const st = new URLSearchParams(location.search).get("st") || "";

  const [result, setResult] = useState<Cafe[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const previousPage = useCallback(() => page > 1 && setPage((page) => page - 1), []);
  const nextPage = useCallback(
    () => result && page < result.length / 10 && setPage((page) => page + 1),
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${config.API_URL}/cafe/search/${st}`, {
      signal: controller.signal
    })
      .then((res) => {
        if (res.status === 500) {
          throw new Error("서버에서 오류가 발생하였습니다.");
        } else if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setResult(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const resultElements = result?.slice((page - 1) * 10, page * 10).map((cafe, index) => (
    <ResultListItem key={index} onClick={() => navigate("/cafe/view/" + cafe._id)}>
      <div className="name">{cafe.cafeName}</div>
      <div>{cafe.owner.username}</div>
    </ResultListItem>
  ));

  return loading ? (
      <Loading></Loading>
  ) : error ? (
      <ErrorMessage>{error}</ErrorMessage>
  ) : (
    <>
      <h1>검색 결과</h1>
      {resultElements?.length ? (
        <>
          <ResultList>{resultElements}</ResultList>
          <p>
            <Button onClick={previousPage}>이전 페이지</Button>
            <span style={{ margin: "0 10px" }}>
              <b>{page}</b>페이지
            </span>
            <Button onClick={nextPage}>다음 페이지</Button>
          </p>
        </>
      ) : (
        <p style={{ color: "gray" }}>
          제목에 '<b>{st}</b>'가 포함된 카페를 찾을 수 없습니다.
        </p>
      )}
    </>
  );
}

const ResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px;
  width: 100%;
`;

const ResultListItem = styled.li`
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

  &:hover {
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.4);
  }
`;
