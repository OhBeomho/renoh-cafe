import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Logout from "./pages/logout";
import Profile from "./pages/profile";
import Search from "./pages/search";
import PostCreate from "./pages/post/create";
import PostView from "./pages/post/view";
import CafeCreate from "./pages/cafe/create";
import CafeView from "./pages/cafe/view";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

type RouteData = {
  path: string;
  element: JSX.Element;
};

function App() {
  const routes: RouteData[] = [
    {
      path: "/",
      element: <Index />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <SignUp />
    },
    {
      path: "/logout",
      element: <Logout />
    },
    {
      path: "/profile",
      element: <Profile />
    },
    {
      path: "/search",
      element: <Search />
    },
    {
      path: "/post/create/:cafeID",
      element: <PostCreate />
    },
    {
      path: "/post/view/:postID",
      element: <PostView />
    },
    {
      path: "/cafe/create",
      element: <CafeCreate />
    },
    {
      path: "/cafe/view/:cafeID",
      element: <CafeView />
    }
  ];

  const routeElements = routes.map((routeData, index) => (
    <Route path={routeData.path} element={routeData.element} key={index} />
  ));

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Renoh Cafe</title>
        <link rel="icon" href="/favicon.ico" sizes="16x16" />
      </Helmet>
      <Routes>{routeElements}</Routes>
    </Layout>
  );
}

export default App;
