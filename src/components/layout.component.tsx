import { Outlet } from "react-router-dom";

type Props = {};

const Layout = (props: Props) => {
  return (
    <main className="App">
      <Outlet />
    </main>
  );
};

export default Layout;
