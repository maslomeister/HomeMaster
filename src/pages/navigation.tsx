import { Navigation } from "decky-frontend-lib";

export let SETTINGS_ROUTE = "/homemaster/settings";

export function navigateToPage(url: string) {
  Navigation.CloseSideMenus();
  Navigation.Navigate(url);
}

export function navigateBack() {
  Navigation.CloseSideMenus();
  Navigation.NavigateBack();
}
