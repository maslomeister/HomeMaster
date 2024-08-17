import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  RoutePatch,
  ServerAPI,
} from "decky-frontend-lib";

import { TbLayoutNavbarExpand } from "react-icons/tb";

import { Settings } from "./app/settings";
import { LocatorProvider } from "./components/locator";
import { Backend } from "./app/backend";
import { patchHome } from "./patches/HomePatch";
import { SettingsPage } from "./pages/settings";
import { navigateToPage, SETTINGS_ROUTE } from "./pages/navigation";

declare global {
  var SteamClient: SteamClient;
  let collectionStore: CollectionStore;
  let appStore: AppStore;
  let loginStore: LoginStore;
  let friendStore: FriendStore;
  let securitystore: SecurityStore;
  let settingsStore: SettingsStore;
}

export default definePlugin((serverAPI: ServerAPI) => {
  let homePatch: RoutePatch;
  const settings = new Settings();
  const backend = new Backend(serverAPI, settings);

  homePatch = patchHome(backend);

  serverAPI.routerHook.addRoute(SETTINGS_ROUTE, () => (
    <LocatorProvider settings={settings}>
      <SettingsPage backend={backend} />
    </LocatorProvider>
  ));

  return {
    title: <>HomeMaster</>,
    content: (
      <PanelSection>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              navigateToPage(SETTINGS_ROUTE);
            }}
          >
            SETTINGS
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    ),
    icon: <TbLayoutNavbarExpand />,
    onDismount: () => {
      serverAPI.routerHook.removePatch("/library/home", homePatch);
    },
  };
});
