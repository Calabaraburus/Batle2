import { _decorator, Component, Node, UIOpacity, tween, Vec2, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PopupWindow")
export class PopupWindow extends Component {
  @property(Vec3)
  initScale: Vec3 = new Vec3(0.1, 0.1, 0.1);
  finaleScale: Vec3 = new Vec3(1, 1, 1);
  @property(UIOpacity)
  _opacity = 255;

  showWindow() {
    this.node.active = true;
    this.node.scale = this.initScale;

    tween(this.node)
      .to(0.4, { scale: this.finaleScale }, { easing: "backOut" })
      .start();
  }

  hideWindow() {
    tween(this.node)
      .to(0.4, { scale: this.initScale }, { easing: "quadInOut" })
      .call(() => {
        this.node.active = false;
      })
      .start();
  }

  closeButton() {
    return;
  }
}
