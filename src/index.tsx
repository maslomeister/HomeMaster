import { TbLayoutNavbarExpand } from "react-icons/tb";

import { Settings } from "./app/settings";
import { LocatorProvider } from "./components/locator";
import { Backend } from "./app/backend";
import { patchHome } from "./patches/HomePatch";
import { Main } from "./pages/main";
import { RoutePatch, definePlugin, routerHook } from "@decky/api";

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

  settings.get().then((currentSetings) => {
    backend.LoadSettings(currentSetings);
    homePatch = patchHome(backend);
  });

  const AppOverviewChangesRegistration =
    SteamClient.Apps.RegisterForAppOverviewChanges(function callback() {
      backend.SetCache(null);
      backend.LoadGamesFromCollection();
    });

  return {
    title: <>HomeMaster</>,
    name: "HomeMaster",
    content: (
      <LocatorProvider settings={settings}>
        <Main backend={backend} />
      </LocatorProvider>
    ),
    icon: <TbLayoutNavbarExpand />,
    onDismount: () => {
      routerHook.removePatch("/library/home", homePatch);
      AppOverviewChangesRegistration.unregister();
    },
  };
});
