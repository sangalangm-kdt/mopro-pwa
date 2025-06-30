//sidebar ui
export const SIDEBAR_PREFERENCES_CONTAINER_CLASSES =
  "border-t border-gray-200 dark:border-zinc-700 mt-6 pt-4 pr-2 space-y-4";

export const SIDEBAR_MENU_LINK_CONTAINER_CLASSES = "space-y-4 pt-4";

export const SIDEBAR_MENU_BUTTON_CLASSES =
  "block w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-primary-100 dark:hover:bg-primary-700 dark:hover:text-primary-100 hover:text-primary-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500";

export const SIDEBAR_ASIDE_CLASSES = `fixed top-0 left-0 w-64 h-full bg-white dark:bg-zinc-800 z-50 shadow-lg transition-transform duration-300 flex flex-col $OPEN`;

export const SIDEBAR_SECTION_HEADING_CLASSES =
  "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1";

export const SIDEBAR_LOGOUT_BUTTON_CLASSES =
  "w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-zinc-700 rounded-md hover:bg-red-50 dark:hover:bg-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500";

export const SIDEBAR_FOOTER_COPYRIGHT_CLASSES =
  "text-xs text-gray-500 border-t pt-4 border-gray-200 dark:border-zinc-700";

//scan result
export const SCAN_RESULT_CLASSES = {
  SHEET_HEIGHT_COLLAPSED: "h-[45%]",
  SHEET_HEIGHT_EXPANDED: "h-[100%]",
  SHEET_TRANSITION_CLASSES:
    "transition-all duration-300 ease-in-out flex flex-col",
  HANDLE_STYLE:
    "w-12 h-1.5 bg-gray-300 dark:bg-gray-700 mx-auto mt-2 mb-4 rounded-full",
};

// form step container (RequestAccount etc.)
export const FORM_STEP_CONTAINER_CLASSES =
  "p-4 rounded-md border border-gray-200 dark:border-zinc-700 space-y-4";
