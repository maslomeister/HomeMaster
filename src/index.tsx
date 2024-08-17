import { definePlugin, RoutePatch, ServerAPI } from "decky-frontend-lib";

import { TbLayoutNavbarExpand } from "react-icons/tb";

import { Settings } from "./app/settings";
import { LocatorProvider } from "./components/locator";
import { Backend } from "./app/backend";
import { patchHome } from "./patches/HomePatch";
import { Main } from "./pages/main";

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

  return {
    title: <>HomeMaster</>,
    content: (
      <LocatorProvider settings={settings}>
        <Main backend={backend} />
      </LocatorProvider>
    ),
    icon: <TbLayoutNavbarExpand />,
    onDismount: () => {
      serverAPI.routerHook.removePatch("/library/home", homePatch);
    },
  };
});
