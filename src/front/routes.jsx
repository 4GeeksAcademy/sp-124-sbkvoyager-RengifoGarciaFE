// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import AdminsPage from "./pages/admins/AdminsPage";
import AdminDetailPage from "./pages/admins/AdminDetailPage";
import AdminFormPage from "./pages/admins/AdminFormPage";
import UbicationFormPage from "./pages/ubications/UbicationFormPage";
import UbicationDetailPage from "./pages/ubications/UbicationDetailPage";
import UbicationsPage from "./pages/ubications/UbicationsPage";
import UsersPage from "./pages/users/UsersPage";
import UserFormPage from "./pages/users/UserFormPage";
import UserDetailPage from "./pages/users/UserDetailPage";
import PostsPage from "./pages/posts/PostsPage";
import PostFormPage from "./pages/posts/PostFormPage";
import PostDetailPage from "./pages/posts/PostDetailPage";
import ImagesPage from "./pages/images/ImagesPage";
import ImageFormPage from "./pages/images/ImageFormPage";
import ImageDetailPage from "./pages/images/ImageDetailPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/admins-user" element={<AdminsPage />} />
      <Route path="/admins-user/:id" element={<AdminDetailPage />} />
      <Route path="/admins-user/new" element={<AdminFormPage />} />
      <Route path="/admins-user/:id/edit" element={<AdminFormPage />} />
      <Route path="/ubications" element={<UbicationsPage />} />
      <Route path="/ubications/:id" element={<UbicationDetailPage />} />
      <Route path="/ubications/new" element={<UbicationFormPage />} />
      <Route path="/ubications/:id/edit" element={<UbicationFormPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/new" element={<UserFormPage />} />
      <Route path="/users/:id/edit" element={<UserFormPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/new" element={<PostFormPage />} />
      <Route path="/posts/:id/edit" element={<PostFormPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/images-post" element={<ImagesPage />} />
      <Route path="/images-post/new" element={<ImageFormPage />} />
      <Route path="/images-post/:id/edit" element={<ImageFormPage />} />
      <Route path="/images-post/:id" element={<ImageDetailPage />} />
    </Route>
  )
);