import { _decorator, Component, Node, CCString } from "cc";
import { Service } from "../services/Service";
const { ccclass, property } = _decorator;

@ccclass("Behaviour")
export class Behaviour extends Service {
  private _target: Component;
  private _isStoped: boolean;

  get isStoped(): boolean {
    return this._isStoped;
  }

  get target(): Component {
    return this._target;
  }
  set target(value: Component) {
    this._target = value;
  }

  @property(CCString)
  type = "";

  activateCondition(): boolean {
    return true;
  }

  activate(): void {
    this._isStoped = false;
  }

  run(): void {
    throw Error("not implemented method");
  }

  stop(): void {
    this._isStoped = true;
  }
}
