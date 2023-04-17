import { _decorator, Component, Node, UIOpacity, tween, Vec2, Vec3 } from "cc";
import { Service } from "../services/Service";
import { DataService } from "../services/DataService";
const { ccclass, property } = _decorator;

@ccclass("popupWindow")
export class popupWindow extends Component {
  @property(Vec3)
  initScale: Vec3 = new Vec3(0.1, 0.1, 0.1);
  finaleScale: Vec3 = new Vec3(1, 1, 1);
  @property(UIOpacity)
  _opacity = 255;

  // _dataService: DataService | null;

  showWindow() {
    // this._dataService = this.getService(DataService);
    // const b = this._dataService?.getComponent("NameBonus");
    // const b2 = this.getComponent("NameBonus");
    // this.getComponentsInChildren();
    this.node.active = true;
    this.node.scale = this.initScale;

    tween(this.node)
      .to(0.5, { scale: this.finaleScale }, { easing: "quadInOut" })
      .start();
  }

  hideWindow() {
    tween(this.node)
      .to(0.5, { scale: this.initScale }, { easing: "quadInOut" })
      .call(() => {
        this.node.active = false;
      })
      .start();
  }

  closeButton() {
    return;
  }
}
