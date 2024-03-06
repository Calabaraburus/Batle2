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
  EventTarget,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("LoaderScreen")
export class LoaderScreen extends Component {
  private _opacity: UIOpacity | null;
  private readonly timeToShow = 0.3;
  private showTween: Tween<UIOpacity | null>;
  private hideTween: Tween<UIOpacity | null>;

  public readonly wndIsShowedEvent: EventTarget = new EventTarget();
  public readonly wndIsHidedEvent: EventTarget = new EventTarget();


  @property(Node)
  loaderNode: Node;

  start() {
    this._opacity = this.loaderNode.getComponent(UIOpacity);

    this.node.active = false;

    this.showTween = tween(this._opacity)
      .set({ opacity: 0 })
      .to(this.timeToShow, { opacity: 255 }, { easing: "linear" })
      .call(() => this.wndIsShowedEvent.emit("wndIsShowed", this));

    this.hideTween = tween(this._opacity).delay(1).call(() => {
      this.showTween.stop();
    })
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

    this.hideTween.start();
  }
}
