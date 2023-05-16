import { WindowManager } from "./WindowManager";
import { PlayerService } from "../services/PlayerService";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { BonusModel } from "../../models/BonusModel";
import { _decorator, find } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CardInfoService")
export class CardInfoService extends PlayerService {
  private _bonuses: BonusModel[];
  private _wManager: WindowManager | null;
  private _levelConfiguration: LevelConfiguration | null;

  onTouch(obj: object, bonusName: string) {
    this._levelConfiguration = this.getService(LevelConfiguration);
    this._wManager = this.getService(WindowManager);
    if (!this._levelConfiguration) return;
    this._bonuses = this._levelConfiguration.botModel.bonuses;
    const bonusNumber = parseInt(bonusName);

    this._wManager?.showCardWindow(this._bonuses[bonusNumber]);
  }
}
