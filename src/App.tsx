import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout.component";
import AddPostForm from "./features/posts/add-post-form.component";
import EditPostForm from "./features/posts/edit-post-form.component";
import PostList from "./features/posts/post-list.component";
import SinglePostPage from "./features/posts/single-post-page";

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
      </Route>
    </Routes>
  );
};

export default App;
