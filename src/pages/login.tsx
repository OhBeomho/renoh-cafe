import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/StyledComponents";
import { config } from "../config";
import { useAuth } from "../context/AuthContext";

export default function () {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  const toggleForm = () => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const inputs = Array.from(form.querySelectorAll("input"));
    const buttons = Array.from(form.querySelectorAll("button"));

    for (let input of inputs) {
      input.disabled = !input.disabled;
    }

    for (let button of buttons) {
      button.disabled = !button.disabled;
    }
  };

  const loginRequest = useCallback((body: any, callback?: () => void) => {
    fetch(`${config.API_URL}/user/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then((res) => {
        if (res.status === 404) {
          throw new Error(`사용자명이 ${username}인 사용자가 없습니다.`);
        } else if (res.status === 401) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        } else if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        const token = data.token;

        login(username, token);
        navigate("/");
      })
      .catch((err: Error) => alert(err.message))
      .finally(() => callback && callback());
  }, [username]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      toggleForm();

      loginRequest({ username, password }, toggleForm);
    },
    [username, password]
  );

  return (
    <>
      <h1>로그인</h1>
      <form ref={formRef} onSubmit={onSubmit}>
        <table>
          <tbody>
            <tr>
              <td>사용자명</td>
              <td>
                <Input
                  name="username"
                  placeholder="사용자명을 입력"
                  onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
                  required={true}
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td>
                <Input
                  name="password"
                  type="password"
                  placeholder={`${username || "사용자"}의 비밀번호를 입력`}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required={true}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <Button type="submit">로그인</Button>
                <Button type="button" onClick={() => navigate("/signup")}>
                  회원가입하기
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}
