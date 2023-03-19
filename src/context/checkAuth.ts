export default function (res: Response) {
  if (res.status === 401) {
    throw new Error("유효하지 않은 토큰입니다.\n다시 로그인 해 주세요.");
  } else if (res.status === 419) {
    throw new Error("토큰의 유효기간이 지났습니다.\n다시 로그인 해 주세요.");
  }
}
