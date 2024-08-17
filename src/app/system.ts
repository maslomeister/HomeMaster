// credits to https://github.com/ma3a/SDH-PlayTime

import { HomeMasterSettings, Settings } from "./settings";

export { LocatorDependencies, Locator as Locator };

interface Locator {
  currentSettings: HomeMasterSettings;
  settings: Settings;
}

interface LocatorDependencies {
  settings: Settings;
}
