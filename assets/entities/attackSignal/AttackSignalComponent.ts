import {
  _decorator,
  Color,
  Component,
  find,
  Node,
  Sprite,
  tween,
  UIOpacity,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("AttackSignalComponent")
export class AttackSignalComponent extends Component {
  active = false;
  sprite: Sprite | null;
  // wndIsShowing = false;
  // wndIsHiding = false;

  start() {
    this.sprite = this.node.getComponent(Sprite);
  }

  showWindow() {
    // if (this.wndIsShowing) return;
    // this.wndIsShowing = true;

    tween(this.sprite)
      // .set({ color: new Color(49, 49, 49, 80) })
      .to(0.2, { color: new Color(255, 255, 255, 255) }, { easing: "quadIn" })
      // .call(() => (this.wndIsShowing = false))
      .start();
  }

  hideWindow() {
    // if (this.wndIsHiding) return;
    // this.wndIsHiding = true;
    tween(this.sprite)
      .to(0.2, { color: new Color(49, 49, 49, 80) }, { easing: "quadOut" })
      // .call(() => (this.wndIsHiding = false))
      .start();
  }
}
