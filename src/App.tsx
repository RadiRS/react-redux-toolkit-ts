import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout.component";
import AddPostForm from "./features/posts/add-post-form.component";
import EditPostForm from "./features/posts/edit-post-form.component";
import PostList from "./features/posts/post-list.component";
import SinglePostPage from "./features/posts/single-post-page";
import UsersList from "./features/users/users-list.component";
import UserPage from "./features/users/user-page.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
