import { _decorator, Component, Node, Label, debug, RichText, RenderTexture } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DebugView")
export class DebugView extends Component {
  static _instance: DebugView;

  @property(Label)
  debugLabel: Label;

  static get instance(): DebugView {
    return this._instance;
  }

  start() {
    DebugView._instance = this;
  }

  public log(value: string) {
    console.log(value);
    if (this.debugLabel.string.length > 5000) {
      this.debugLabel.string = "";
    }
    this.debugLabel.string += value + "\n";
  }
}
