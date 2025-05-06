import { createContext, useState, ReactNode } from "react";

type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

interface ToastContextProps {
  showToast: (message: string, type?: Toast["type"]) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextProps | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const closeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`relative animate-slide-in flex items-center justify-between w-[320px] max-w-full rounded-lg border p-4 shadow-md transition-all
              ${
                toast.type === "success"
                  ? "bg-green-100 border-green-300  text-green-800"
                  : toast.type === "error"
                  ? "bg-red-50 border-red-300  text-red-500"
                  : "bg-blue-100 border-blue-300  text-blue-800"
              }
            `}
          >
            {/* Toast Message */}
            <div className="text-sm font-semibold">{toast.message}</div>

            {/* Close Button */}
            <button
              onClick={() => closeToast(toast.id)}
              className="ml-4 text-gray-500 hover:text-gray-700 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
