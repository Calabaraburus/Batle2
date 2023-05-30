import { AudioSource, SpriteFrame, _decorator, director } from "cc";
import { MainMenu } from "./MainMenu";
import { LoaderScreen } from "./LoaderScreen";
import { AudioManager } from "../../soundsPlayer/AudioManager";
const { ccclass, property } = _decorator;

@ccclass("MenuSelectorController")
export class MenuSelectorController extends MainMenu {
  private _tarnsitionScene = new LoaderScreen();
  private _aManager: AudioManager | null;
  menuSections = ["mainMenuLayout", "gameMenuLayout", "optionsMenuLayout"];

  start(): void {
    if (this._aManager == null) return;
    this._aManager.playMusic("epic");

    // const audioManager = director.getScene()?.getChildByName("__audioMgr__");
    // if (!audioManager) return;
    // if (!this._aManager) return;
    // const aSours = audioManager.getComponent(AudioSource)

    // if (aSours == null) return;
    // aSours.clip = this._aManager.music[0];
  }

  onLoad(): void {
    this._aManager = this.getComponent(AudioManager);
  }

  openSectionMenu(sender: object, sectionMenu: string): void {
    this.menuSections.forEach((name) => {
      if (name != sectionMenu) {
        const menuFrom = this.node.getChildByName(name);
        if (menuFrom != null) {
          menuFrom.active = false;
        }
      }
    });

    const menuTo = this.node.getChildByName(sectionMenu);

    if (!menuTo) return;

    menuTo.active = true;
  }

  loadScene(sender: object, sceneName: string): void {
    director.loadScene(sceneName);
  }

  settingOptions(sender: object, managerName: string) {
    // const audioManager = director.getScene()?.getChildByName("__audioMgr__");

    if (managerName == "music") {
      this._aManager?.changeVolume(this._aManager?.audioSource);
    } else if (managerName == "sound") {
      this._aManager?.changeVolume(this._aManager?.soundSource);
    }
  }
}
