import { _decorator, director } from "cc";
import { MainMenu } from "./MainMenu";
import { LoaderScreen } from "./LoaderScreen";
const { ccclass, property } = _decorator;

@ccclass("MenuSelectorController")
export class MenuSelectorController extends MainMenu {
  private _tarnsitionScene = new LoaderScreen();
  menuSections = ["mainMenuLayout", "gameMenuLayout", "optionsMenuLayout"];

  openSectionMenu(sender: object, sectionMenu: string): void {
    this.menuSections.forEach((i) => {
      if (i != sectionMenu) {
        const menuFrom = this.node.getChildByName(i);
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
}
