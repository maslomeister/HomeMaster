import { definePlugin, RoutePatch, ServerAPI } from "decky-frontend-lib";

import { TbLayoutNavbarExpand } from "react-icons/tb";

import { Settings } from "./app/settings";
import { LocatorProvider } from "./components/locator";
import { Backend } from "./app/backend";
import { patchHome } from "./patches/HomePatch";
import { Main } from "./pages/main";
import { logger } from "./utils";

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
  logger.info("Intialize");

  let homePatch: RoutePatch;
  const settings = new Settings();
  const backend = new Backend(serverAPI, settings);

  settings.get().then((currentSettings) => {
    backend.LoadSettings(currentSettings);
    homePatch = patchHome(backend);
  });

  const AppOverviewChangesRegistration =
    SteamClient.Apps.RegisterForAppOverviewChanges(() => {
      if (backend.IsCollectionChanged()) {
        backend.SetCache(null);
        backend.LoadGamesFromCollection();
      }
    });

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
      // There's no unregister on RegisterForAppOverviewChanges, not sure how to properly handle this
      // AppOverviewChangesRegistration.unregister();
    },
  };
});
