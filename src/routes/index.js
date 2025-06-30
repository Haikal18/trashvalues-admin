import Home from "../pages/Home";
import Login from "../pages/Login";
import Layout from "../components/Layout";
import Profile from "../pages/Profile";
import Dropoff from "../pages/Dropoff";
import History from "../pages/History";
import WasteTypes from "../pages/WasteTypes";

export const publicRoutes = [
  {
    path: "/login",
    component: Login,
  },
];

export const protectedRoutes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "dashboard",
        component: Home,
      },
      {
        path: "profile",
        component: Profile,
      },
      {
        path: "dropoff",
        component: Dropoff,
      },
      {
        path: "history",
        component: History,
      },
      {
        path: "waste-types",
        component: WasteTypes,
      },
      {
        path: "",
        redirectTo: "/dashboard",
      },
      {
        path: "*",
        redirectTo: "/dashboard",
      },
    ],
  },
];
