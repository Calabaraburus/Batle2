import { _decorator, assert, director, math, Node } from "cc";
import { MainMenu } from "./MainMenu";
import { LoaderScreen } from "./LoaderScreen";
import { AudioManagerService } from "../../soundsPlayer/AudioManagerService";
import { SettingsLoader } from "../services/SettingsLoader";
import { GameState } from "../game/GameState";
import { GameParameters } from "../game/GameParameters";
import { MenuOptionsItem } from "./MenuOptionsItem";
import { Window } from "../ui/window/Window";
import { Service } from "../services/Service";
import { SceneLoaderService } from "../services/SceneLoaderService";
import { GameManager } from "../game/GameManager";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { LevelSelectorController } from "../level/LevelSelectorController";
const { ccclass, property } = _decorator;

@ccclass("MenuSelectorController")
export class MenuSelectorController extends Service {
  private _aManager: AudioManagerService | null | undefined;

  @property(Node)
  sections: Node[] = [];

  @property(Node)
  soundCross: Node;

  @property(Node)
  musicCross: Node;

  @property(Node)
  soundCross2: Node;

  @property(Node)
  musicCross2: Node;

  @property(Node)
  soundBtns: Node[] = [];

  @property(Node)
  musicBtns: Node[] = [];

  settingsLoader: SettingsLoader;
  parameters: GameParameters;
  private _sceneLoader: SceneLoaderService;
  private _gameManager: GameManager | null;
  private _levelConfig: LevelConfiguration;
  private _levelSelector: LevelSelectorController;

  start(): void {

    this._sceneLoader = this.getServiceOrThrow(SceneLoaderService);
    this._gameManager = this.getService(GameManager);
    this._aManager = this.getService(AudioManagerService);
    this._levelConfig = this.getServiceOrThrow(LevelConfiguration);
    this._levelSelector = this.getServiceOrThrow(LevelSelectorController);

    assert(this._aManager != null, "Can't find AudioManagerService");


    this._aManager.playMusic("start_menu");

    const tService = this.getService(SettingsLoader);

    assert(tService != null, "SettingsLoader can't be found");

    this.settingsLoader = tService;

    this.parameters = this.settingsLoader.gameParameters;

    this.musicCross2.active = false;
    this.soundCross2.active = false;

    this.settingSound(this, this.parameters.soundLevel.toString());
    this.settingMusic(this, this.parameters.musicLevel.toString());
  }

  onLoad(): void {
    this._aManager = this.getComponent(AudioManagerService);
  }

  openSectionMenu(sender: object, sectionMenu: string): void {
    this.sections.forEach((section) => {
      if (section.name != sectionMenu) {
        section.active = false;
      } else {
        section.active = true;
      }
    });
  }

  loadScene(sender: object, sceneName: string): void {
    this._gameManager?.stop();

    this._sceneLoader.loadLevel(sceneName);
  }

  reloadMission() {
    this._gameManager?.stop();
    this._levelSelector.loadLevel(this, this._levelConfig.levelName);
  }

  settingSound(sender: object, volumeStr: string) {

    const volume = parseFloat(volumeStr);

    this._aManager?.changeVolume(volume, "sound");

    this.parameters.soundLevel = volume;
    this.settingsLoader.saveParameters();

    this.setCross(this.soundBtns, this.soundCross, this.soundCross2, volume);
  }

  settingMusic(sender: object, volumeStr: string) {
    const volume = parseFloat(volumeStr);
    this._aManager?.changeVolume(volume, "music");

    this.parameters.musicLevel = volume;
    this.settingsLoader.saveParameters();

    this.setCross(this.musicBtns, this.musicCross, this.musicCross2, volume);
  }

  setCross(btns: Node[], cross: Node, cross2: Node, volume: number) {
    const btn = this.getButtonByVolume(btns, volume);
    cross.position = btn.position.clone();

    if (volume == 0) {
      cross.active = false;
      cross2.active = true;
    } else {
      cross.active = true;
      cross2.active = false;
    }

  }

  getButtonByVolume(btns: Node[], volume: number) {
    const id = Math.round(volume * (btns.length - 1));
    return btns[id];
  }
}
