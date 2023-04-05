import { _decorator } from "cc";
import { LevelModel } from "../../models/LevelModel";
import { PlayerModel } from "../../models/PlayerModel";
import { DataService } from "./DataService";
import { Service } from "./Service";
const { ccclass } = _decorator;

@ccclass("CardService")
export class CardService extends Service {
  _dataService: DataService | null;
  private _levelModel: LevelModel | null;

  start() {
    this._dataService = this.getService(DataService);
    this._levelModel = this.getService(LevelModel);
  }

  public updateBonusesActiveState(): void {
    const currentPlayer = this.getCurrentPlayerModel();
    currentPlayer?.bonuses.forEach((bonus) => {
      if (this._levelModel?.gameMechanicType == 0) {
        bonus.active = currentPlayer.manaCurrent >= bonus.priceToActivate;
      } else {
        bonus.active = bonus.currentAmmountToActivate >= bonus.priceToActivate;
      }
    });
  }

  public resetBonusesForActivePlayer(): void {
    this.getCurrentPlayerModel()?.bonuses.forEach(
      (b) => (b.alreadyUsedOnTurn = false)
    );
  }

  getCurrentPlayerModel(): PlayerModel | null | undefined {
    return this._dataService?.gameManager?.playerTurn
      ? this._dataService?.playerModel
      : this._dataService?.botModel;
  }

  getOponentModel(): PlayerModel | null | undefined {
    return this._dataService?.gameManager?.playerTurn
      ? this._dataService?.botModel
      : this._dataService?.playerModel;
  }

  getPlayerTag(): string {
    return this._dataService?.gameManager?.playerTurn ? "player" : "enemy";
  }

  getOponentTag(): string {
    return this._dataService?.gameManager?.playerTurn ? "enemy" : "player";
  }
}
