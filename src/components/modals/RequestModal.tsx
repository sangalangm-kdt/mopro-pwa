import Button from "@/components/buttons/Button";
import { REQUEST_ACCOUNT_TEXT_KEYS, ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SuccessModal({ show, onClose }: SuccessModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const TEXT = REQUEST_ACCOUNT_TEXT_KEYS;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-400 mb-2">
          {t(TEXT.SUCCESS.TITLE)}
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {t(TEXT.SUCCESS.DESCRIPTION)}
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate(ROUTES.LOGIN)}
          className="w-full"
        >
          {t(TEXT.SUCCESS.GO_TO_LOGIN)}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="w-full mt-2 text-gray-500"
        >
          {t(TEXT.SUCCESS.STAY_HERE)}
        </Button>
      </div>
    </div>
  );
}
