import { FieldController } from "../../field/FieldController";
import { CardService } from "../../services/CardService";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class PushCardSubehaviour extends CardsSubBehaviour {
  private _cardsService: CardService | null;
  private _field: FieldController | null | undefined;
  private _tilesToDestroy: TileController[] | undefined;

  prepare(): boolean {
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();
    const matrix = this.parent.field?.fieldMatrix;
    let targetRow = 10;
    if (
      this._cardsService?.getCurrentPlayerModel() ==
      this._cardsService?._dataService?.botModel
    ) {
      targetRow = 1;
    }
    if (matrix == null) return false;

    if (playerTag == null) return false;
    if (this.parent.cardsService == null) return false;

    if (targetTile instanceof StdTileController) {
      if (targetTile.tileModel.containsTag(playerTag)) {
        return false;
      }
    } else {
      return false;
    }

    this.effectDurationValue = 0.5;
    this._cardsService = this.parent.cardsService;
    this._field = this.parent.field;

    if (this._cardsService == null) return false;
    if (this._field == null) return false;
    this._tilesToDestroy = [];

    matrix.forEachInRow(targetRow, (tile, colId) => {
      if (this.parent.cardsService == null) return;
      if (
        tile.tileModel.containsTag(this.parent.cardsService.getOponentTag())
      ) {
        this._tilesToDestroy?.push(tile);
      }
    });

    return true;
  }

  run(): boolean {
    if (!this._tilesToDestroy) return false;
    this._tilesToDestroy.forEach((tile) => {
      this.parent.field?.fakeDestroyTile(tile);
    });

    return true;
  }

  effect(): boolean {
    this.parent.field?.moveTilesAnimate();

    return true;
  }
}
