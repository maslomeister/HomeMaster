import { ServerAPI } from "decky-frontend-lib";
import { PythonInterop } from "./PythonInterop";
import { SteamController } from "./SteamController";
import { LogController } from "./LogController";
import { getCurrentUserId } from "../Utils";

/**
 * Main controller class for the plugin.
 */
export class PluginController {
  // @ts-ignore
  private static server: ServerAPI;
  // private static homeMasterManager: HomeMasterManager;

  private static steamController: SteamController;

  private static onWakeSub: Unregisterer;

  /**
   * Sets the plugin's serverAPI.
   * @param server The serverAPI to use.
   */
  static setup(server: ServerAPI): void {
    this.server = server;
    // this.homeMasterManager = homeMasterManager;
    this.steamController = new SteamController();
  }

  /**
   * Sets the plugin to initialize once the user logs in.
   * @returns The unregister function for the login hook.
   */
  static initOnLogin(onMount: () => Promise<void>): Unregisterer {
    return this.steamController.registerForAuthStateChange(
      async (username) => {
        LogController.log(`User logged in. [DEBUG] username: ${username}.`);
        if (await this.steamController.waitForServicesToInitialize()) {
          await PluginController.init();
          onMount();
        } else {
          PythonInterop.toast("Error", "Failed to initialize, try restarting.");
        }
      },
      async (username) => {
        LogController.log(`User logged out. [DEBUG] username: ${username}.`);
      },
      true,
      true
    );
  }

  /**
   * Initializes the Plugin.
   */
  static async init(): Promise<void> {
    LogController.log("PluginController initialized.");

    this.onWakeSub = this.steamController.registerForOnResumeFromSuspend(
      this.onWakeFromSleep.bind(this)
    );
  }

  /**
   * Function to run when resuming from sleep.
   */
  static onWakeFromSleep() {
    // TODO: make sure patching happens
  }

  /**
   * Function to run when the plugin dismounts.
   */
  static dismount(): void {
    if (this.onWakeSub) this.onWakeSub.unregister();

    // this.homeMasterManager.disposeReactions();

    LogController.log("PluginController dismounted.");
  }
}
