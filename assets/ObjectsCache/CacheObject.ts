import { Component, EventTarget, _decorator } from "cc";
import { ICacheObject } from "./ICacheObject";
const { ccclass, property } = _decorator;

@ccclass("CacheObject")
export class CacheObject extends Component implements ICacheObject {
  public readonly destroyEvent: EventTarget = new EventTarget();
  cacheCreate(): void {
    this.node.active = true;
  }

  public cacheDestroy(): void {
    this.node.active = false;
    this.destroyEvent.emit("destroy_object", this);
  }
}
