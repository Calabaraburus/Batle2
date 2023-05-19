import { Service } from "../services/Service";
import { BonusModel } from "../../models/BonusModel";
import { PlayerModel } from "../../models/PlayerModel";
import { PlayerInfoWindow } from "./PlayerInfoWindow";
import { CardInfoWindow } from "./CardInfoWindow";
import { _decorator } from "cc";
import { PlayerInfoService } from "./PlayerInfoService";
const { ccclass, property } = _decorator;

@ccclass("WindowManager")
export class WindowManager extends Service {
  public showPlayerWindow(playerModel: PlayerModel) {
    const pWindow = this.getService(PlayerInfoWindow);
    pWindow?.setPlayer(playerModel);
    pWindow?.showWindow();
  }

  public showCardWindow(cardModel: BonusModel | undefined) {
    const wnd = this.getService(CardInfoWindow);
    if (!cardModel) return;
    wnd?.setCard(cardModel);
    wnd?.showWindow();
  }
}
