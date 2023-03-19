import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
  useEffect
} from "react";
import { getUser, removeUser, setUser } from "../utils/userStorage";

export type LoggedUser = {
  token: string;
  username: string;
};

type Callback = () => void;

type ContextType = {
  loggedUser?: LoggedUser;
  login: (username: string, token: string) => void;
  logout: (callback?: Callback) => void;
};

export const AuthContext = createContext<ContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | undefined>();

  const login = useCallback((username: string, token: string) => {
    const user = { username, token };

    setLoggedUser(user);
    setUser(user);
  }, []);
  const logout = useCallback((callback?: Callback) => {
    setLoggedUser(undefined);
    removeUser();
    callback && callback();
  }, []);

  useEffect(() => setLoggedUser(getUser()), []);

  const value = {
    loggedUser,
    login,
    logout
  };

  return <AuthContext.Provider value={value} children={children}></AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth 는 AuthProvider 안에서 사용되어야 합니다.");
  }

  return context;
};
