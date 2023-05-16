import { _decorator, ParticleSystem, Node, Vec3, Quat } from "cc";
import { CacheObject } from "../../ObjectsCache/CacheObject";
import { CardEffect } from "./CardEffect";
const { ccclass, property } = _decorator;

@ccclass("HealingEffect")
export class HealingEffect extends CardEffect {
  @property(Node)
  nodeToRotate: Node;

  @property()
  speed = 100;

  @property()
  speed2 = 1000;

  protected update(dt: number): void {
    const vec: Vec3 = this.nodeToRotate.eulerAngles.clone();
    vec.z += this.speed * dt;
    this.nodeToRotate.setRotationFromEuler(vec);
  }
}
