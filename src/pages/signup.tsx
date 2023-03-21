import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/StyledComponents";
import { config } from "../config";

export default function () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const signupRequest = useCallback(
    (body: FormData, callback?: () => void) => {
      fetch(`${config.API_URL}/user/signup`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(body))
      })
        .then((res) => {
          if (res.status === 500) {
            alert("서버에서 오류가 발생하였습니다.");
          } else if (res.status === 400) {
            alert(username + "는 이미 존재하는 사용자 입니다.");
          } else if (res.ok) {
            navigate("/login");
          }
        })
        .finally(() => callback && callback());
    },
    [username, password, confirmPassword]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      toggleForm();

      const data = new FormData();
      data.append("username", username);
      data.append("password", password);

      signupRequest(data, toggleForm);
    },
    [username, password]
  );

  return (
    <>
      <h1>회원가입</h1>
      <form ref={formRef} onSubmit={onSubmit}>
        <table>
          <tbody>
            <tr>
              <td>사용자명</td>
              <td>
                <Input
                  name="username"
                  placeholder="새로 만들 사용자 이름 입력"
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
                  placeholder={`${username || "사용자"}의 비밀번호 입력`}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required={true}
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호 확인</td>
              <td>
                <Input
                  name="confirmPassword"
                  placeholder="비밀번호 재입력"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required={true}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <Button type="submit">회원가입</Button>
                <Button type="button" onClick={() => navigate("/login")}>
                  로그인하기
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}
