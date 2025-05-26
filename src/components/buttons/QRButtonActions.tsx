import Button from "./Button";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QR_BUTTON_ACTIONS_TEXT_KEYS } from "@/constants";

interface QRButtonActionsProps {
  lineNumber: string;
  onClose: () => void;
  showEdit?: boolean;
  showSave?: boolean;
  onSave?: () => void;
}

export default function QRButtonActions({
  lineNumber,
  onClose,
  showEdit = true,
  showSave = false,
  onSave,
}: QRButtonActionsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex justify-between gap-3 z-[201]">
      <Button
        onClick={onClose}
        variant={"outlined"}
        className="w-full max-w-[50%]"
      >
        {showSave
          ? t(QR_BUTTON_ACTIONS_TEXT_KEYS.CANCEL)
          : t(QR_BUTTON_ACTIONS_TEXT_KEYS.CLOSE)}
      </Button>

      {showSave ? (
        <Button className="w-full max-w-[50%]" onClick={onSave}>
          {t(QR_BUTTON_ACTIONS_TEXT_KEYS.SAVE)}
        </Button>
      ) : (
        showEdit && (
          <Button
            variant="primary"
            className="w-full max-w-[50%]"
            onClick={() =>
              navigate(ROUTES.EDIT_PROGRESS.replace(":lineNumber", lineNumber))
            }
          >
            {t(QR_BUTTON_ACTIONS_TEXT_KEYS.EDIT_PROGRESS)}
          </Button>
        )
      )}
    </div>
  );
}
