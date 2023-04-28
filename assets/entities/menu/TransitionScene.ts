import {
  _decorator,
  Component,
  director,
  find,
  tween,
  UIOpacity,
  Vec3,
} from "cc";
import { LevelSelectorController } from "../level/LevelSelectorController";
const { ccclass, property } = _decorator;

@ccclass("TransitionScene")
export class TransitionScene extends Component {
  private _lvlController = new LevelSelectorController();

  onLoad() {
    director.addPersistRootNode(this.node);
  }

  public prepareLoadScene(sender: object, sceneName: string) {
    this.node.active = true;
    tween(this.node.getComponent(UIOpacity))
      .to(0.2, { opacity: 255 }, { easing: "linear" })
      //   .to(0.5, { position: new Vec3(0, 0, 0) }, { easing: "bounceIn" })
      .call(() => {
        this._lvlController?.loadLevel(sceneName);
      })
      .start()
      .delay(3)
      .to(0.2, { opacity: 0 }, { easing: "linear" })
      .call(() => {
        this.node.active = false;
      })
      .start();
  }

  //   loadScene(sceneName: string): void {
  //     director.loadScene(sceneName);
  //   }
}
