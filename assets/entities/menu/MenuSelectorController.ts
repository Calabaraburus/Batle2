import { AudioSource, SpriteFrame, _decorator, director, find, game } from "cc";
import { MainMenu } from "./MainMenu";
import { LoaderScreen } from "./LoaderScreen";
import { AudioManager } from "../../soundsPlayer/AudioManager";
import { AudioManagerService } from "../../soundsPlayer/AudioManagerService";
import { GameMenuService } from "./GameMenuService";
const { ccclass, property } = _decorator;

@ccclass("MenuSelectorController")
export class MenuSelectorController extends MainMenu {
  private _tarnsitionScene = new LoaderScreen();
  private _aManager: AudioManagerService | null | undefined;
  menuSections = ["Menu/MainMenu", "Menu/gameMenuLayout", "Menu/OptionsMenu"];

  start(): void {
    this.init();

    if (this._aManager == null) return;
    this._aManager.playMusic("start_menu");

    // const audioManager = director.getScene()?.getChildByName("__audioMgr__");
    // if (!audioManager) return;
    // if (!this._aManager) return;
    // const aSours = audioManager.getComponent(AudioSource)
    // if (aSours == null) return;
    // aSours.clip = this._aManager.music[0];
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

    menuTo.active = true;
  }

  loadScene(sender: object, sceneName: string): void {
    // stop start audio track
    const currentScene = director.getScene()?.name;
    if (currentScene == "scene_dev_art_1") {
      director
        .getScene()
        ?.getChildByName("__audioMgr__")
        ?.getComponent(AudioSource)
        ?.stop();

      this._aManager?.playMusic("start_menu");
    } else if (sceneName == "scene_dev_art_1") {
      director
        .getScene()
        ?.getChildByName("__audioMgr__")
        ?.getComponent(AudioSource)
        ?.stop();
    }

    director.loadScene(sceneName);
  }

  settingSuond(sender: object, volume: string) {
    this.getGameMenuAudioManager();
    this._aManager?.changeVolume(parseFloat(volume), "sound");
  }

  settingMusic(sender: object, volume: string) {
    this.getGameMenuAudioManager();
    this._aManager?.changeVolume(parseFloat(volume), "music");
  }

  getGameMenuAudioManager() {
    if (this.node.name == "MenuGame") {
      this._aManager = this.node.getComponent(GameMenuService)?.audioManager;
    }
  }
}
