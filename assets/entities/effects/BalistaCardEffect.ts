import { _decorator, ParticleSystem, Node } from "cc";
import { CacheObject } from "../../ObjectsCache/CacheObject";
import { CardEffect } from "./CardEffect";
const { ccclass, property } = _decorator;

@ccclass("BalistaCardEffect")
export class BalistaCardEffect extends CardEffect {
  private isplaying = false;

  @property({ type: ParticleSystem })
  systems: ParticleSystem[] = [];

  @property({ type: Node })
  arrowSpriteNode: Node;

  @property({ type: Node })
  aim: Node;

  play() {
    this.isplaying = true;
    this.systems.forEach((s) => {
      s.play();
    });
  }

  stop() {
    this.isplaying = false;
    this.systems.forEach((s) => {
      s.stop();
    });
  }

  stopEmmit() {
    this.systems.forEach((s) => {
      s.stopEmitting();
    });
  }
}
