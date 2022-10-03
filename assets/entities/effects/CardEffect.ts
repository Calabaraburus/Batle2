import { _decorator, Component, Node, ParticleSystem, sys } from "cc";
import { CacheObject } from "../../ObjectsCache/CacheObject";
const { ccclass, property } = _decorator;

@ccclass("CardEffect")
export class CardEffect extends CacheObject {
  @property({ type: ParticleSystem })
  systems: ParticleSystem[] = [];

  cacheCreate() {
    super.cacheCreate();
  }

  play() {
    this.systems.forEach((s) => {
      s.play();
    });
  }

  stop() {
    this.systems.forEach((s) => {
      s.stop();
    });
  }

  stopEmmit() {
    this.systems.forEach((s) => {
      s.stopEmitting();
    });
  }

  cacheDestroy() {
    this.stop();

    super.cacheDestroy();
  }
}
