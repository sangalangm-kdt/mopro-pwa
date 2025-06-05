interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export function isInStandaloneMode(): boolean {
  const navigatorWithStandalone = window.navigator as NavigatorStandalone;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}
