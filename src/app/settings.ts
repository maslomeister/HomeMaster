// credits to https://github.com/ma3a/SDH-PlayTime

import logger from "../utils";

declare global {
  // @ts-ignore
  let SteamClient: SteamClient;
}

export interface HomeMasterSettings {
  showPatchedHome: boolean;
  hideCollectionName: boolean;
  collectionData: {
    collectionId: string;
    collectionName: string;
  };
}

let HOME_MASTER_SETTINGS_KEY = "decky-home-master";
export let DEFAULTS: HomeMasterSettings = {
  showPatchedHome: false,
  hideCollectionName: false,
  collectionData: { collectionId: "", collectionName: "" },
};

export class Settings {
  constructor() {
    SteamClient.Storage.GetJSON(HOME_MASTER_SETTINGS_KEY).catch((e: any) => {
      if ((e.message = "Not found")) {
        logger.error("Unable to get settings, saving defaults", e);
        SteamClient.Storage.SetObject(HOME_MASTER_SETTINGS_KEY, DEFAULTS);
      } else {
        logger.error("Unable to get settings", e);
      }
    });
  }

  async get(): Promise<HomeMasterSettings> {
    let settings = await SteamClient.Storage.GetJSON(HOME_MASTER_SETTINGS_KEY);
    if (settings == undefined) {
      return DEFAULTS;
    }
    return JSON.parse(settings) as HomeMasterSettings;
  }

  async save(data: HomeMasterSettings) {
    await SteamClient.Storage.SetObject(HOME_MASTER_SETTINGS_KEY, data);
  }
}
