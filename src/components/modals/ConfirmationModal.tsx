// components/modals/ConfirmationModal.tsx
export default function ConfirmationModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title ?? "Confirm Logout"}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-md text-base font-medium hover:bg-red-700 transition"
          >
            Log Out
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-md text-base font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
