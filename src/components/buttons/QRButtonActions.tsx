import Button from "./Button";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

interface QRButtonActionsProps {
  serialNumber: string;
  onClose: () => void;
  showEdit?: boolean;
  showSave?: boolean;
  onSave?: () => void;
}

export default function QRButtonActions({
  serialNumber,
  onClose,
  showEdit = true,
  showSave = false,
  onSave,
}: QRButtonActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex justify-between gap-3 z-[201]">
      <Button
        onClick={onClose}
        variant={"outlined"}
        className="w-full max-w-[50%]"
      >
        {showSave ? "Cancel" : "Close"}
      </Button>

      {showSave ? (
        <Button className="w-full max-w-[50%]" onClick={onSave}>
          Save
        </Button>
      ) : (
        showEdit && (
          <Button
            variant="primary"
            className="w-full max-w-[50%]"
            onClick={() =>
              navigate(
                ROUTES.EDIT_PROGRESS.replace(":serialNumber", serialNumber)
              )
            }
          >
            Edit Progress
          </Button>
        )
      )}
    </div>
  );
}
