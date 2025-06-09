import Button from "@/components/buttons/Button";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SuccessModal({ show, onClose }: SuccessModalProps) {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-400 mb-2">
          Request Submitted
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Your request has been successfully submitted. We will get back to you
          soon.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate(ROUTES.LOGIN)}
          className="w-full"
        >
          Go to Login
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="w-full mt-2 text-gray-500"
        >
          Stay Here
        </Button>
      </div>
    </div>
  );
}
