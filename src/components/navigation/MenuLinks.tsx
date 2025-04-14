interface MenuLinksProps {
  onClose: () => void;
}

import {
  SIDEBAR_MENU_LINK_CONTAINER_CLASSES,
  SIDEBAR_MENU_BUTTON_CLASSES,
  SIDEBAR_SECTION_HEADING_CLASSES,
} from "@/constants/classes";

export default function MenuLinks({ onClose }: MenuLinksProps) {
  return (
    <div className={SIDEBAR_MENU_LINK_CONTAINER_CLASSES}>
      <h2 className={SIDEBAR_SECTION_HEADING_CLASSES}>Navigation</h2>
      <nav className="space-y-2">
        <button onClick={onClose} className={SIDEBAR_MENU_BUTTON_CLASSES}>
          User Guidelines
        </button>
        <button onClick={onClose} className={SIDEBAR_MENU_BUTTON_CLASSES}>
          Help & Support
        </button>
      </nav>
    </div>
  );
}
