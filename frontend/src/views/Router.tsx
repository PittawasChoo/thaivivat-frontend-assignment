import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../layouts/Layout";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import PageNotFound from "./pages/error/page-not-found/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
