import { ServerAPI } from "decky-frontend-lib";
import { DEFAULTS, HomeMasterSettings, Settings } from "./settings";

export class Backend {
  public serverAPI: ServerAPI;
  public settings: Settings;
  public currentSettings: HomeMasterSettings = DEFAULTS;
  private games: Number[];

  constructor(serverAPI: ServerAPI, settings: Settings) {
    this.serverAPI = serverAPI;
    this.settings = settings;
    this.games = Array.from(collectionStore.recentAppsCollection.apps.keys());
  }

  public LoadSettings(newSettings: HomeMasterSettings) {
    const previousCollectionId =
      this.currentSettings.collectionData.collectionId;

    if (previousCollectionId != newSettings.collectionData.collectionId) {
      this.currentSettings = newSettings;

      if (newSettings.collectionData.collectionId === "") {
        this.games = Array.from(
          collectionStore.recentAppsCollection.apps.keys()
        );
      } else {
        this.LoadGamesFromCollection();
      }
    }
  }

  public async InitSettings() {
    this.settings.get().then((newSettings) => {
      this.currentSettings = newSettings;
    });
  }

  public LoadGamesFromCollection() {
    if (this.currentSettings.collectionData.collectionId) {
      this.games = collectionStore
        .GetCollection(this.currentSettings.collectionData.collectionId)
        .allApps.sort((a, b) => {
          return (
            b.rt_last_time_played_or_installed -
            a.rt_last_time_played_or_installed
          );
        })
        .map((app) => app.appid)
        .slice(0, 20);
    } else {
      this.games = collectionStore.recentAppCollections[0].allApps
        .filter((app) => app.app_type === 1)
        .map((app) => app.appid)
        .slice(0, 20);
    }
  }

  public GetGames() {
    return this.games;
  }

  public GetCollectionName() {
    if (this.currentSettings.hideCollectionName) {
      return "";
    } else {
      return this.currentSettings.collectionData.collectionName;
    }
  }
}
