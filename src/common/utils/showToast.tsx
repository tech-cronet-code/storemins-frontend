import { toast, Toast } from "react-hot-toast";

type ToastType = "success" | "error" | "info";

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  showClose?: boolean;
}

const baseStyle: Record<ToastType, React.CSSProperties> = {
  success: {
    backgroundColor: "#e6f4ea",
    color: "#166534",
    border: "1px solid #34d399",
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #f87171",
  },
  info: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #60a5fa",
  },
};

export const showToast = ({
  message,
  type = "info",
  duration = 4000,
  showClose = true,
}: ToastConfig) => {
  toast.custom((t: Toast) => {
    if (!t) return null; // ✅ guard clause

    return (
      <div
        className="min-w-[280px] max-w-sm mx-auto flex items-center justify-between px-4 py-4 rounded-lg shadow-lg animate-slide-in-up"
        style={baseStyle[type]}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "info" && "ℹ️"}
          <span className="block">{message}</span>
        </div>

        {showClose && (
          <button
            onClick={() => t && toast.dismiss(t.id)}
            className="text-gray-600 hover:text-black text-base ml-4 leading-none"
          >
            ✕
          </button>
        )}
      </div>
    );
  }, { duration });
};
