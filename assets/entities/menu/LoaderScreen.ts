import {
  _decorator,
  Component,
  director,
  find,
  Tween,
  tween,
  UIOpacity,
  Vec3,
  Node,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("LoaderScreen")
export class LoaderScreen extends Component {
  private _opacity: UIOpacity | null;
  private readonly timeToShow = 0.3;
  showTween: Tween<UIOpacity | null>;
  hideTween: Tween<UIOpacity | null>;

  @property(Node)
  loaderNode: Node;

  start() {
    this._opacity = this.loaderNode.getComponent(UIOpacity);
    this.showTween = tween(this._opacity)
      .set({ opacity: 0 })
      .to(this.timeToShow, { opacity: 255 }, { easing: "linear" });

    this.hideTween = tween(this._opacity)
      .to(this.timeToShow, { opacity: 0 }, { easing: "linear" })
      .call(() => {
        this.node.active = false;
      });
  }

  show() {
    this.hideTween.stop();
    this.node.active = true;
    this.showTween.start();
  }

  hide() {
    this.showTween.stop();
    this.hideTween.start();
  }
}
