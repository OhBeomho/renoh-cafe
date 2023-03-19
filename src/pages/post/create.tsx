import React, { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { Button, Input, Textarea } from "../../components/StyledComponents";
import { config } from "../../config";
import { useAuth } from "../../context/AuthContext";
import checkAuth from "../../context/checkAuth";

export default function () {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { loggedUser } = useAuth();
  if (!loggedUser) {
    navigate("/");
    return <div></div>;
  }

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const cafeID = String(params.cafeID);
  const cafeName = new URLSearchParams(location.search).get("cn");

  const toggleForm = () => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const inputs = Array.from(form.querySelectorAll("input"));
    const buttons = Array.from(form.querySelectorAll("button"));
    const textareas = Array.from(form.querySelectorAll("textarea"));

    for (let input of inputs) {
      input.disabled = !input.disabled;
    }

    for (let button of buttons) {
      button.disabled = !button.disabled;
    }

    for (let textarea of textareas) {
      textarea.disabled = !textarea.disabled;
    }
  };

  const createPostRequest = useCallback((body: FormData, callback?: () => void) => {
    fetch(`${config.API_URL}/post`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: loggedUser.token
      },
      body: JSON.stringify(Object.fromEntries(body))
    })
      .then((res) => {
        checkAuth(res);

        if (res.status === 500) {
          throw new Error("서버에서 오류가 발생하였습니다.");
        } else if (res.status === 400) {
          throw new Error("카페 멤버가 아닙니다.");
        } else if (res.ok) {
          navigate("/cafe/view/" + cafeID);
        }
      })
      .catch((err: Error) => alert(err.message))
      .finally(() => callback && callback());
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      toggleForm();

      const data = new FormData();
      data.append("cafeID", cafeID);
      data.append("title", title);
      data.append("content", content);

      createPostRequest(data, toggleForm);
    },
    [title, content]
  );

  return (
    <>
      <h1>{cafeName}에 글쓰기</h1>
      <form ref={formRef} onSubmit={onSubmit} style={{ width: "100%" }}>
        <p>
          제목&nbsp;
          <Input
            placeholder="제목을 입력하세요."
            onChange={(e) => setTitle(e.target.value)}
            required={true}
          />
        </p>
        <Textarea rows={10} required={true} onChange={(e) => setContent(e.target.value)}></Textarea>
        <br />
        <Button type="submit">글쓰기</Button>
        <Button type="button" onClick={() => navigate(-1)}>
          취소
        </Button>
      </form>
    </>
  );
}
