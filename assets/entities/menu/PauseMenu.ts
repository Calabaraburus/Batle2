import { Sprite, UIOpacity, Vec3, _decorator, find, tween, Node } from "cc";
import { MainMenu } from "./MainMenu";
import { Window } from "../ui/window/Window";
import { Service } from "../services/Service";

const { ccclass, property } = _decorator;

@ccclass("PauseMenu")
export class PauseMenu extends Service {

  @property(Node)
  overlay: Node | null = null;

  @property(Window)
  menuWnd: Window | null = null;

  showWindow() {
    if (!this.overlay) return;
    if (!this.menuWnd) return;

    this.overlay.active = true;

    tween(this.overlay.getComponent(UIOpacity))
      .to(0.2, { opacity: 200 }, { easing: "linear" })
      .start();

    this.menuWnd.showWindow();
  }

  hideWindow() {
    if (!this.overlay) return;
    if (!this.menuWnd) return;

    this.menuWnd.hideWindow();

    tween(this.overlay.getComponent(UIOpacity))
      .to(0.4, { opacity: 0 }, { easing: "linear" })
      .call(() => {
        if (this.overlay) {
          this.overlay.active = false;
        }
      })
      .start();
  }

  closeButton() {
    return;
  }
}
