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
import AdminPanelPage from "./pages/admins/AdminPanelPage";

import UbicationsPage from "./pages/ubications/UbicationsPage";
import UbicationDetailPage from "./pages/ubications/UbicationDetailPage";
import UbicationFormPage from "./pages/ubications/UbicationFormPage";

import UsersPage from "./pages/users/UsersPage";
import UserFormPage from "./pages/users/UserFormPage";
import UserDetailPage from "./pages/users/UserDetailPage";

import PostsPage from "./pages/posts/PostsPage";
import PostFormPage from "./pages/posts/PostFormPage";
import PostDetailPage from "./pages/posts/PostDetailPage";

import CommentsPage from "./pages/comments/CommentsPage";
import CommentFormPage from "./pages/comments/CommentFormPage";
import CommentDetailPage from "./pages/comments/CommentDetailPage";

import ImagesPage from "./pages/images/ImagesPage";
import ImageFormPage from "./pages/images/ImageFormPage";
import ImageDetailPage from "./pages/images/ImageDetailPage";

import LoginPage from "./pages/LoginPage";
import ProtectedPage from "./pages/ProtectedPage";

import ProfilePage from "./pages/ProfilePage";



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="single/:theId" element={<Single />} />

      <Route path="admins-user" element={<AdminsPage />} />
      <Route path="admins-user/new" element={<AdminFormPage />} />
      <Route path="admins-user/:id" element={<AdminDetailPage />} />
      <Route path="admins-user/:id/edit" element={<AdminFormPage />} />

      <Route path="ubications" element={<UbicationsPage />} />
      <Route path="ubications/new" element={<UbicationFormPage />} />
      <Route path="ubications/:id" element={<UbicationDetailPage />} />
      <Route path="ubications/:id/edit" element={<UbicationFormPage />} />

      <Route path="users" element={<UsersPage />} />
      <Route path="users/new" element={<UserFormPage />} />
      <Route path="users/:id" element={<UserDetailPage />} />
      <Route path="users/:id/edit" element={<UserFormPage />} />

      <Route path="posts" element={<PostsPage />} />
      <Route path="posts/new" element={<PostFormPage />} />
      <Route path="posts/:id" element={<PostDetailPage />} />
      <Route path="posts/:id/edit" element={<PostFormPage />} />

      <Route path="comments" element={<CommentsPage />} />
      <Route path="comments/new" element={<CommentFormPage />} />
      <Route path="comments/:id" element={<CommentDetailPage />} />

      <Route path="images-post" element={<ImagesPage />} />
      <Route path="images-post/new" element={<ImageFormPage />} />
      <Route path="images-post/:id" element={<ImageDetailPage />} />
      <Route path="images-post/:id/edit" element={<ImageFormPage />} />

      <Route path="login" element={<LoginPage />} />
    <Route path="protected" element={<ProtectedPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="admin-panel" element={<AdminPanelPage />} />
    <Route path="demo" element={<Demo />} />
    </Route>
  )
);