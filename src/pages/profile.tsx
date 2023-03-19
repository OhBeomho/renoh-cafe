import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { config } from "../config";
import { useAuth } from "../context/AuthContext";

type User = {
  username: string;
  joinDate: Date;
  cafeCount: number;
  postCount: number;
  commentCount: number;
};

export default function () {
  const { loggedUser } = useAuth();
  const location = useLocation();
  const username = new URLSearchParams(location.search).get("u");
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsername = username ? username : loggedUser?.username;

    fetch(`${config.API_URL}/user/${fetchUsername}`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error(`사용자명이 ${fetchUsername}인 사용자를 찾을 수 없습니다.`);
        } else if (res.status === 500) {
          throw new Error("서버에서 오류가 발생하였습니다.");
        } else if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setUser(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <ErrorMessage>{error}</ErrorMessage>
  ) : (
    <>
      <h1>사용자 프로필</h1>
      <table style={{ margin: "0 auto" }}>
        <tbody>
          <tr>
            <td>
              <b>사용자명</b>
            </td>
            <td>{user?.username}</td>
          </tr>
          <tr>
            <td>
              <b>가입 날짜</b>
            </td>
            <td>{new Date(user?.joinDate || Date.now()).toLocaleDateString("ko-KR")}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ textAlign: "center" }}>
        <span>가입한 카페 {user?.cafeCount}개</span>
        <span style={{ margin: "0 10px" }}>게시글 {user?.postCount}개</span>
        <span>댓글 {user?.commentCount}개</span>
      </p>
    </>
  );
}
