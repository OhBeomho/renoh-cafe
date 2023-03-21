import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { Button } from "../../components/StyledComponents";
import { config } from "../../config";
import { useAuth } from "../../context/AuthContext";
import checkAuth from "../../context/checkAuth";

type User = { username: string };

type Post = {
  _id: string;
  title: string;
  createDate: Date;
  writer: User;
};

type Cafe = {
  cafeName: string;
  posts: Post[];
  members: User[];
  owner: User;
  createDate: Date;
};

export default function () {
  const navigate = useNavigate();
  const params = useParams();
  const { loggedUser } = useAuth();

  const [page, setPage] = useState(1);
  const [cafe, setCafe] = useState<Cafe>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cafeID = String(params.cafeID);

  const previousPage = useCallback(() => page > 1 && setPage((page) => page - 1), []);
  const nextPage = useCallback(
    () => cafe && page < cafe.posts.length / 10 && setPage((page) => page + 1),
    []
  );

  const deleteCafeRequest = useCallback(() => {
    if (!loggedUser) {
      return;
    }

    fetch(`${config.API_URL}/cafe/${cafeID}`, {
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
          throw new Error("카페 주인이 아닙니다.");
        } else if (res.ok) {
          navigate("/");
        }
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const leaveOrJoinCafe = useCallback((type: "join" | "leave") => {
    if (!loggedUser) {
      return;
    }

    setLoading(true);

    fetch(`${config.API_URL}/cafe/${type}/${cafeID}`, {
      headers: {
        Authorization: loggedUser.token
      }
    })
      .then((res) => {
        checkAuth(res);

        if (res.status === 500) {
          throw new Error("서버에서 에러가 발생하였습니다.");
        } else if (res.ok) {
          loadCafe();
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const loadCafe = useCallback((signal?: AbortSignal) => {
    fetch(`${config.API_URL}/cafe/${cafeID}`, { signal })
      .then((res) => {
        if (res.status === 404) {
          throw new Error(`ID가 ${cafeID}인 카페를 찾을 수 없습니다.`);
        } else if (res.status === 500) {
          throw new Error("서버에서 오류가 발생하였습니다.");
        } else if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setCafe(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadCafe(controller.signal);

    return () => controller.abort();
  }, []);

  const postElements = cafe?.posts.slice((page - 1) * 10, page * 10).map((post, index) => (
    <PostListItem key={index} onClick={() => navigate("/post/view/" + post._id)}>
      <b>{post.title}</b>
      <div>
        {
          post.writer?.username ?
            (
              <span style={{ marginRight: 4 }}>{post.writer.username}</span>
            ) : (
              <span style={{ marginRight: 4, color: "darkgray" }}>deleted user</span>
            )
        }
        <span style={{ color: "gray" }}>
          {new Date(post.createDate).toLocaleDateString("ko-KR")}
        </span>
      </div>
    </PostListItem>
  ));

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <ErrorMessage>{error}</ErrorMessage>
  ) : (
    <>
      <h1>{cafe?.cafeName}</h1>
      <div style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <CafeInfo>
          <h3>카페 정보</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  <b>카페 관리자</b>
                </td>
                <td>
                  {
                    cafe?.owner?.username ?
                      (
                        <Link to={`/profile?u=${cafe.owner.username}`}>
                          {cafe.owner.username}
                        </Link>
                      ) : (
                        <span style={{ color: "darkgray" }}>deleted user</span>
                      )
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <b>멤버 수</b>
                </td>
                <td>{Number(cafe?.members.length) + 1}</td>
              </tr>
              <tr>
                <td>
                  <b>게시글 수</b>
                </td>
                <td>{cafe?.posts.length}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  {loggedUser &&
                    (loggedUser.username === cafe?.owner?.username ? (
                      <>
                        <Link to={`/post/create/${cafeID}?cn=${cafe?.cafeName}`}>글쓰기</Link>
                        <Button
                          type="button"
                          onClick={() => {
                            if (confirm("정말로 이 카페를 삭제하시겠습니까?")) {
                              deleteCafeRequest();
                            }
                          }}
                        >
                          카페 삭제
                        </Button>
                      </>
                    ) : cafe?.members.find((member) => member.username === loggedUser.username) ? (
                      <>
                        <Link to={`/post/create/${cafeID}?cn=${cafe?.cafeName}`}>글쓰기</Link>
                        <Button type="button" onClick={() => leaveOrJoinCafe("leave")}>
                          카페 탈퇴
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => leaveOrJoinCafe("join")}>
                        카페 가입
                      </Button>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        </CafeInfo>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h3>카페 글 목록</h3>
          {postElements?.length ? (
            <PostList>{postElements}</PostList>
          ) : (
            <p style={{ color: "gray" }}>글이 없습니다.</p>
          )}
          <div>
            <Button onClick={previousPage}>이전 페이지</Button>
            <span style={{ margin: "0 10px" }}>
              <b>{page}</b>페이지
            </span>
            <Button onClick={nextPage}>다음 페이지</Button>
          </div>
        </div>
      </div>
    </>
  );
}

const CafeInfo = styled.div`
  height: max-content;
  padding: 6px;
  text-align: center;
  border: 1.5px solid rgb(50, 50, 50);
`;

const PostList = styled.ul`
  list-style: none;
  padding: 6px;
  margin: 0;
`;

const PostListItem = styled.li`
  padding: 4px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.4);
  }
`;
