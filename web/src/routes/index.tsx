import { Suspense, lazy, ElementType } from "react";
import { useRoutes, useLocation, Navigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import AuthGuard from "../guards/AuthGuard";
import GuestGuard from "../guards/GuestGuard";
import HomeLayout from "../layouts/Blog";
import Page404 from "../pages/Page404";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { element: <Blog />, index: true },
        {
          path: "detail/:fullname/:title",
          element: (
              <BlogDetail />
          ),
        },
        {
          path: "profile",
          element: (
            <AuthGuard>
              <Profile />
            </AuthGuard>
          ),
        },
        {
          path: "wishlist",
          element: (
            <AuthGuard>
              <WishList />
            </AuthGuard>
          ),
        },
        {
          path: "create/article",
          element: (
            <AuthGuard>
              <CreatePost />
            </AuthGuard>
          ),
        },
      ],
    },
    { path: "404", element: <Page404 /> },
    {
      path: "*",
      element: (
          <Navigate to="/404" replace />
      ),
    },
    {
      path: "/login",
      children: [
        {
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
          index: true,
        },
      ],
    },
    {
      path: "/register",
      children: [
        {
          element: <Register />,
          index: true,
        },
      ],
    },
  ]);
}

const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Register = Loadable(lazy(() => import("../pages/auth/Register")));
const Blog = Loadable(lazy(() => import("../pages/blog/Blog")));
const BlogDetail = Loadable(
  lazy(() => import("../pages/blog-detail/BlogDetail"))
);
const Profile = Loadable(lazy(() => import("../pages/profile/Profile")));
const WishList = Loadable(lazy(() => import("../pages/wishlist/WishList")));
const CreatePost = Loadable(lazy(() => import("../pages/create-post/CreatePost")));
