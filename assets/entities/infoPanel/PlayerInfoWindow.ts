import { PlayerModel } from "../../models/PlayerModel";
import { PopupWindow } from "./PopupWindow";
import { Label, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerInfoWindow")
export class PlayerInfoWindow extends PopupWindow {
  public setPlayer(playerModel: PlayerModel) {
    const playerName = playerModel.playerName;
    const bonuses = playerModel.bonuses;
    const componentName = this.node.getChildByName("NameBonus");
    if (!componentName) return;
    const labelName = componentName?.getComponent(Label);
    if (!labelName) return;
    labelName.string = playerName;
  }
}
