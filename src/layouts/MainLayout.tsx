import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header>/* nav goes here */</header>
      <main>
        <Outlet />
      </main>
      <footer>/* footer here */</footer>
    </div>
  );
}
