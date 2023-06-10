import {
  AmbientInfo,
  AudioSource,
  SpriteFrame,
  _decorator,
  assert,
  director,
  find,
  game,
} from "cc";
import { MainMenu } from "./MainMenu";
import { LoaderScreen } from "./LoaderScreen";
import { AudioManager } from "../../soundsPlayer/AudioManager";
import { AudioManagerService } from "../../soundsPlayer/AudioManagerService";
import { GameMenuService } from "./GameMenuService";
import { SettingsLoader } from "../services/SettingsLoader";
import { TstFireSmokeSrvc } from "../services/TstFireSmokeSrvc";
import { GameState } from "../game/GameState";
import { GameParameters } from "../game/GameParameters";
const { ccclass, property } = _decorator;

@ccclass("MenuSelectorController")
export class MenuSelectorController extends MainMenu {
  private _tarnsitionScene = new LoaderScreen();
  private _aManager: AudioManagerService | null | undefined;
  menuSections = ["Menu/MainMenu", "Menu/gameMenuLayout", "Menu/OptionsMenu"];
  settingsLoader: SettingsLoader;
  parameters: GameParameters;
  state: GameState;

  start(): void {
    this.init();

    this._aManager = this.getService(AudioManagerService);

    if (this._aManager == null) return;
    this._aManager.playMusic("start_menu");

    const tService = this.getService(SettingsLoader);

    assert(tService, "SettingsLoader can't be found");

    this.settingsLoader = tService;

    this.parameters = this.settingsLoader.gameParameters;
    this.state = this.settingsLoader.gameState;

    this.settingSound(this, this.parameters.soundLevel.toString());
    this.settingMusic(this, this.parameters.musicLevel.toString());
  }

  onLoad(): void {
    this._aManager = this.getComponent(AudioManagerService);
  }

  openSectionMenu(sender: object, sectionMenu: string): void {
    this.menuSections.forEach((name) => {
      if (name != sectionMenu) {
        const menuFrom = find(name, this.node);
        // const menuFrom = this.node.getChildByName(name);
        if (menuFrom != null) {
          menuFrom.active = false;
        }
      }
    });

    const menuTo = find(sectionMenu, this.node);

    if (!menuTo) return;
    this._aManager?.playSoundEffect("click");
    menuTo.active = true;
  }

  loadScene(sender: object, sceneName: string): void {
    // stop start audio track
    const currentScene = director.getScene()?.name;
    if (currentScene == "scene_dev_art_1") {
      this._aManager?.stopMusic();

      this._aManager?.playMusic("start_menu");
    } else if (sceneName == "scene_dev_art_1") {
      this._aManager?.stopMusic();
    }
    this._aManager?.playSoundEffect("click");
    director.loadScene(sceneName);
  }

  settingSound(sender: object, volume: string) {
    this.getGameMenuAudioManager();
    this._aManager?.changeVolume(parseFloat(volume), "sound");

    this.parameters.soundLevel = parseFloat(volume);
    this.settingsLoader.saveParameters();
  }

  settingMusic(sender: object, volume: string) {
    this.getGameMenuAudioManager();
    this._aManager?.changeVolume(parseFloat(volume), "music");

    this.parameters.musicLevel = parseFloat(volume);
    this.settingsLoader.saveParameters();
  }

  getGameMenuAudioManager() {
    if (this.node.name == "MenuGame") {
      this._aManager = this.node.getComponent(GameMenuService)?.audioManager;
    }
  }
}
