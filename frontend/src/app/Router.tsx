import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Feed from "./pages/feed/Feed";
import PageNotFound from "./pages/error/page-not-found/PageNotFound";
import "./App.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Feed />,
        errorElement: <PageNotFound />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
