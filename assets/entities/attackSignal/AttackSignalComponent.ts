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
  opacity: UIOpacity | null;
  // wndIsShowing = false;
  // wndIsHiding = false;

  start() {
    this.opacity = this.node.getComponent(UIOpacity);
  }

  showWindow() {
    // if (this.wndIsShowing) return;
    // this.wndIsShowing = true;

    tween(this.opacity)
      // .set({ color: new Color(49, 49, 49, 80) })
      .to(0.2, { opacity: 255 }, { easing: "quadIn" })
      // .call(() => (this.wndIsShowing = false))
      .start();
  }

  hideWindow() {
    // if (this.wndIsHiding) return;
    // this.wndIsHiding = true;
    tween(this.opacity)
      .to(0.2, { opacity: 40 }, { easing: "quadOut" })
      // .call(() => (this.wndIsHiding = false))
      .start();
  }
}
