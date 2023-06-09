import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/StyledComponents";
import { config } from "../../config";
import { useAuth } from "../../context/AuthContext";
import checkAuth from "../../context/checkAuth";

export default function () {
  const navigate = useNavigate();
  const { loggedUser } = useAuth();
  if (!loggedUser) {
    navigate("/");
    return <div></div>;
  }

  const [cafeName, setCafeName] = useState("");
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

  const createCafeRequest = useCallback((body: any, callback?: () => void) => {
    fetch(`${config.API_URL}/cafe`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: loggedUser.token
      },
      body: JSON.stringify(body)
    })
      .then((res) => {
        checkAuth(res);

        return res.json();
      })
      .then((data) => {
        if (!data) {
          return;
        }

        const cafeID = data.id;
        navigate("/cafe/view/" + cafeID);
      })
      .catch((err: Error) => alert(err.message))
      .finally(() => callback && callback());
  }, []);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toggleForm();

    createCafeRequest({ cafeName }, toggleForm);
  }, [cafeName]);

  return (
    <>
      <h1>카페 생성</h1>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        style={{ textAlign: "center" }}
      >
        <b>카페 이름</b>
        <br />
        <Input
          name="cafeName"
          placeholder="카페 이름을 입력해 주세요."
          onChange={(e) => setCafeName(e.target.value)}
          required={true}
        />
        <br />
        <Button type="submit">카페 생성</Button>
        <Button type="button" onClick={() => navigate(-1)}>
          취소
        </Button>
      </form>
    </>
  );
}
