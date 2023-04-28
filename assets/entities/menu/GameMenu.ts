import { Sprite, UIOpacity, Vec3, _decorator, find, tween } from "cc";
import { MainMenu } from "./MainMenu";

const { ccclass, property } = _decorator;

@ccclass("GameMenu")
export class GameMenu extends MainMenu {
  get _overlay() {
    return find("Overlay", this.node);
  }
  get _menu() {
    return find("Menu", this.node);
  }

  showWindow() {
    if (!this._overlay) return;
    if (!this._menu) return;
    this._overlay.active = true;

    tween(this._overlay.getComponent(UIOpacity))
      .to(0.2, { opacity: 200 }, { easing: "linear" })
      .start();

    this._menu.active = true;
    tween(this._menu)
      .to(0.6, { position: new Vec3(0, 0, 0) }, { easing: "backInOut" })
      .start();
  }

  hideWindow() {
    if (!this._overlay) return;
    if (!this._menu) return;

    tween(this._menu)
      .to(0.4, { position: new Vec3(0, 2000, 0) }, { easing: "linear" })
      .call(() => {
        if (this._menu) {
          this._menu.active = false;
        }
      })
      .start();

    tween(this._overlay.getComponent(UIOpacity))
      .to(0.4, { opacity: 0 }, { easing: "linear" })
      .call(() => {
        if (this._overlay) {
          this._overlay.active = false;
        }
      })
      .start();
  }

  closeButton() {
    return;
  }
}
