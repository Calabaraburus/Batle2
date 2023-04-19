import { Service } from "../services/Service";
import { BonusModel } from "../../models/BonusModel";
import { PlayerModel } from "../../models/PlayerModel";
import { PlayerInfoWindow } from "./PlayerInfoWindow";
import { CardInfoWindow } from "./CardInfoWindow";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("WindowManager")
export class WindowManager extends Service {
  public showPlayerWindow(playerModel: PlayerModel) {
    const wnd = this.getService(PlayerInfoWindow);
    wnd?.setPlayer(playerModel);
    wnd?.showWindow();
  }

  public showCardWindow(cardModel: BonusModel) {
    const wnd = this.getService(CardInfoWindow);
    wnd?.setCard(cardModel);
    wnd?.showWindow();
  }
}
