import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function () {
  const { logout } = useAuth();
  const navigate = useNavigate();

  logout(() => navigate("/"));

  return <p>로그아웃 중...</p>;
}
