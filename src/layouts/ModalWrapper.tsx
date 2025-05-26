import { Outlet } from "react-router-dom";

export default function ModalWrapper() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 scrollbar">
      <Outlet />
    </div>
  );
}
