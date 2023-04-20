import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelConstructor")
export class LevelConstructor extends Component {
  @property(String)
  public Name = "level1";

  start() {}

  update(deltaTime: number) {}
}
