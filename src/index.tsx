import {
  definePlugin,
  LifetimeNotification,
  RoutePatch,
  ServerAPI,
} from "decky-frontend-lib";
import { TbLayoutNavbarExpand } from "react-icons/tb";

import { Settings } from "./app/settings";
import { LocatorProvider } from "./components/locator";
import { Backend } from "./app/backend";
import { patchHome } from "./patches/HomePatch";
import { Main } from "./pages/main";
import { RoutePatch, definePlugin, routerHook } from "@decky/api";
import { awaitGameInfo, logger } from "./utils";

declare global {
  let collectionStore: CollectionStore;
  let appStore: AppStore;
  let loginStore: LoginStore;
  let friendStore: FriendStore;
  let securitystore: SecurityStore;
  let settingsStore: SettingsStore;
}


export default definePlugin(() => {
  let homePatch: RoutePatch;
  const settings = new Settings();
  const backend = new Backend(settings);

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

  const GameStartedOrStoppedRegistration =
    SteamClient.GameSessions.RegisterForAppLifetimeNotifications(
      async (data: LifetimeNotification) => {
        let game = await awaitGameInfo();
        if (game == null || game == undefined) {
          game = {
            id: data.unAppID.toString(),
            name: "",
          };
        }
        if (data.bRunning || !data.bRunning) {
          backend.SetCache(null);
          backend.LoadGamesFromCollection();
        }
      }
    );

  return {
    name: "HomeMaster",
    title: <>HomeMaster</>,
    content: (
      <LocatorProvider settings={settings}>
        <Main backend={backend} />
      </LocatorProvider>
    ),
    icon: <TbLayoutNavbarExpand />,
    onDismount: () => {
      routerHook.removePatch("/library/home", homePatch);
      AppOverviewChangesRegistration.unregister();
      serverAPI.routerHook.removePatch("/library/home", homePatch);
      // There's no unregister on RegisterForAppOverviewChanges, not sure how to properly handle this
      // AppOverviewChangesRegistration.unregister();
      GameStartedOrStoppedRegistration.unregister();
    },
  };
});
