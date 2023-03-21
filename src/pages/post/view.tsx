import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { Button, Textarea } from "../../components/StyledComponents";
import { config } from "../../config";
import { useAuth } from "../../context/AuthContext";
import checkAuth from "../../context/checkAuth";

type User = { username: string };

type Comment = {
  _id: string;
  content: string;
  createDate: Date;
  writer: User;
};

type Post = {
  _id: string;
  title: string;
  content: string;
  createDate: Date;
  writer: User;
  comments: Comment[];
};

export default function () {
  const { loggedUser } = useAuth();

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const postID = String(params.postID);

  const toggleForm = () => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const textarea = form.querySelector("textarea");
    if (!textarea) {
      return;
    }

    textarea.disabled = !textarea.disabled;
  };

  const loadPost = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    fetch(`${config.API_URL}/post/${postID}`, { signal })
      .then((res) => {
        if (res.status === 404) {
          throw new Error(`ID가 ${postID}인 글을 찾을 수 없습니다.`);
        } else if (res.status === 500) {
          throw new Error("서버에서 오류가 발생하였습니다.");
        } else if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setPost(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    loadPost(controller.signal);

    return () => controller.abort();
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!loggedUser) {
        return;
      }

      toggleForm();

      const data = new FormData();
      data.append("postID", postID);
      data.append("content", content);

      commentRequest(data, toggleForm);
    },
    [content]
  );

  const commentRequest = useCallback((body: FormData, callback?: () => void) => {
    if (!loggedUser) {
      callback && callback();
      return;
    }

    fetch(`${config.API_URL}/post/comment`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: loggedUser.token
      },
      body: JSON.stringify(Object.fromEntries(body))
    })
      .then((res) => {
        if (res.status === 500) {
          throw new Error("서버에서 오류가 발생하였습니다.");
        } else if (res.ok) {
          loadPost();
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => callback && callback());
  }, []);

  const deletePostOrComment = useCallback(
    (id: string, type: "post" | "comment", callback?: () => void) => {
      if (!loggedUser) {
        return;
      }

      fetch(`${config.API_URL}${type === "post" ? "/post/" : "/post/comment/"}${id}`, {
        method: "delete",
        headers: {
          Authorization: loggedUser.token
        }
      })
        .then((res) => {
          checkAuth(res);

          if (res.status === 500) {
            throw new Error("서버에서 오류가 발생하였습니다.");
          } else if (res.status === 400) {
            throw new Error(`${type === "post" ? "글" : "댓글"}의 작성자가 아닙니다.`);
          } else {
            type === "post" ? navigate(-1) : loadPost();
          }
        })
        .catch((err: Error) => alert(err.message))
        .finally(() => callback && callback());
    },
    []
  );

  const commentElements = post?.comments.map((comment, index) => (
    <CommentListItem key={index}>
      <CommentInfo>
        <div>
          <b>
            {
              comment.writer?.username ?
                (
                  <Link
                    to={`/profile?u=${comment.writer.username}`}
                    style={{
                      color:
                        post.writer.username === comment.writer.username ? "rgb(50, 50, 200)" : "black"
                    }}
                  >
                    {comment.writer.username}
                  </Link>
                ) : (
                  <span style={{ color: "darkgray" }}>deleted user</span>
                )
            }
          </b>
          {post.writer && post.writer?.username === comment.writer?.username && <Writer />}
        </div>
        <div style={{ color: "gray" }}>
          {new Date(comment.createDate).toLocaleDateString("ko-KR")}
        </div>
      </CommentInfo>
      <Content>{comment.content}</Content>
      {comment.writer?.username === loggedUser?.username && (
        <Button
          type="button"
          onClick={(e) => {
            const button = e.target as HTMLButtonElement;

            button.disabled = true;
            deletePostOrComment(comment._id, "comment", () => (button.disabled = false));
          }}
          style={{ margin: 0, marginTop: 10 }}
        >
          삭제
        </Button>
      )}
    </CommentListItem>
  ));

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <ErrorMessage>{error}</ErrorMessage>
  ) : (
    <>
      <h1>{post?.title}</h1>
      <PostInfo>
        <b>
          {
            post?.writer?.username ?
              (
                <Link to={`/profile?u=${post?.writer.username}`} style={{ color: "black" }}>
                  {post?.writer.username}
                </Link>
              ) : (
                <span style={{ color: "darkgray" }}>deleted user</span>
              )
          }
        </b>
        <div style={{ color: "gray" }}>
          {new Date(post?.createDate || Date.now()).toLocaleDateString("ko-KR")}
        </div>
      </PostInfo>
      <Line />
      <Content style={{ paddingBottom: 70 }}>{post?.content}</Content>
      {loggedUser?.username === post?.writer?.username
        && <Button onClick={(e) => {
          const button = e.target as HTMLButtonElement;

          if (!post) {
            return;
          }

          button.disabled = true;
          deletePostOrComment(post._id, "post", () => (button.disabled = false));
        }}>삭제</Button>}
      <Line />
      <h3>댓글 목록</h3>
      {commentElements?.length ? (
        <CommentList>{commentElements}</CommentList>
      ) : (
        <p style={{ color: "gray" }}>댓글이 없습니다.</p>
      )}
      <h3>댓글 작성</h3>
      {loggedUser ? (
        <form
          ref={formRef}
          onSubmit={onSubmit}
          placeholder="댓글 내용을 입력하세요."
          style={{ textAlign: "center", width: "100%" }}
        >
          <Textarea rows={5} onChange={(e) => setContent(e.target.value)}></Textarea>
          <Button type="submit">댓글 달기</Button>
        </form>
      ) : (
        <p style={{ color: "gray" }}>로그인 후 댓글을 달 수 있습니다.</p>
      )}
    </>
  );
}

const PostInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  white-space: pre-wrap;
  word-break: break-all;
`;

const CommentList = styled.ul`
  list-style: none;
  width: 90%;
  padding: 0;
  margin: 0;
`;

const CommentListItem = styled.li`
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
  margin: 10px 0;
  box-shadow: 0 1.5px 0 0 rgba(0, 0, 0, 0.4);
`;

const CommentInfo = PostInfo;

const Line = styled.hr`
  border: 1px solid rgb(50, 50, 50);
  background-color: rgb(50, 50, 50);
  width: 100%;
`;

const Writer = styled.span`
  padding: 2.5px;
  margin: 0 4px;
  border-radius: 12px;
  font-size: 12px;
  background-color: rgb(150, 150, 255);
  color: rgb(80, 80, 150);

  &::after {
    content: "작성자";
  }
`;
