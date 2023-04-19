import { PlayerModel } from "../../models/PlayerModel";
import { PopupWindow } from "./PopupWindow";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerInfoWindow")
export class PlayerInfoWindow extends PopupWindow {
  public setPlayer(playerModel: PlayerModel) {
    return;
  }
}
