import { _decorator, Component, Node, debug, log } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
const { ccclass, property } = _decorator;

@ccclass("EnemyFieldController")
export class EnemyFieldController extends Component {
  @property(PlayerModel)
  playerModel: PlayerModel;

  public updateData(): void {
    log("");
  }
}
