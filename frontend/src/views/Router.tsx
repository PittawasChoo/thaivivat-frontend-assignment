import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "layouts/Layout";
import Home from "views/pages/home/Home";
import Profile from "views/pages/profile/Profile";
import PageNotFound from "views/pages/error/page-not-found/PageNotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "profile/:username", element: <Profile /> },

            { path: "*", element: <PageNotFound /> },
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
