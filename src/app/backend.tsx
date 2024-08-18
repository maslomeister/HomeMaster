import { ServerAPI } from "decky-frontend-lib";
import { DEFAULTS, HomeMasterSettings, Settings } from "./settings";

export class Backend {
  public serverAPI: ServerAPI;
  public settings: Settings;
  public currentSettings: HomeMasterSettings = DEFAULTS;
  private games: Number[];
  private cache: any = null;
  private collectionCachedLength: Number;

  constructor(serverAPI: ServerAPI, settings: Settings) {
    this.serverAPI = serverAPI;
    this.settings = settings;
    this.games = collectionStore.recentAppCollections[0].allApps
      .filter((app) => app.app_type === 1)
      .map((app) => app.appid)
      .slice(0, 20);
    this.collectionCachedLength =
      collectionStore.recentAppCollections[0].allApps.length;
  }

  public LoadSettings(newSettings: HomeMasterSettings) {
    this.SetCache(null);

    const previousCollectionId =
      this.currentSettings.collectionData.collectionId;

    this.currentSettings = newSettings;

    if (previousCollectionId != newSettings.collectionData.collectionId) {
      this.LoadGamesFromCollection();
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

      this.collectionCachedLength = collectionStore.GetCollection(
        this.currentSettings.collectionData.collectionId
      ).allApps.length;
    } else {
      this.games = collectionStore.recentAppCollections[0].allApps
        .filter((app) => app.app_type === 1)
        .map((app) => app.appid)
        .slice(0, 20);

      this.collectionCachedLength =
        collectionStore.recentAppCollections[0].allApps.length;
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

  public SetCache(cache: any) {
    this.cache = cache;
  }

  public GetCache() {
    return this.cache;
  }

  public IsCollectionChanged() {
    if (this.currentSettings.collectionData.collectionId === "") {
      if (
        this.collectionCachedLength !==
        collectionStore.recentAppCollections[0].allApps.length
      ) {
        this.collectionCachedLength =
          collectionStore.recentAppCollections[0].allApps.length;
        return true;
      }
    }

    if (
      this.collectionCachedLength !==
      collectionStore.GetCollection(
        this.currentSettings.collectionData.collectionId
      ).allApps.length
    ) {
      this.collectionCachedLength = collectionStore.GetCollection(
        this.currentSettings.collectionData.collectionId
      ).allApps.length;
      return true;
    }

    return false;
  }
}
