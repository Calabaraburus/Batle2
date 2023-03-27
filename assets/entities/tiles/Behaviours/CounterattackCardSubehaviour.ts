import { randomRangeInt, Vec2 } from "cc";
import { lightning, LightningVector } from "../../effects/lightning";
import { FieldAnalizer } from "../../field/FieldAnalizer";
import { FieldController } from "../../field/FieldController";
import { CardService } from "../../services/CardService";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class CounterattackCardSubehaviour extends CardsSubBehaviour {
  protected maxCount = 9;
  private _tilesToRun: TileController[] | undefined;
  private _cardsService: CardService | null;
  private _field: FieldController | null | undefined;
  private _borderTiles: TileController[] | undefined;
  private _tilesToDestroy: TileController[] | undefined;

  prepare(): boolean {
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();
    let currentTag = "enemy";
    let motionForce = 8;
    let addToRow = [1, 2];

    const matrix = this.parent.field?.fieldMatrix;
    if (matrix == null) return false;

    if (playerTag == null) return false;
    if (this.parent.cardsService == null) return false;

    const playerModel = this.parent.cardsService.getCurrentPlayerModel();
    const botModel = this._cardsService?._dataService?.botModel;

    if (targetTile instanceof StdTileController) {
      if (targetTile.tileModel.containsTag(playerTag)) {
        return false;
      }
    } else {
      return false;
    }

    this._tilesToRun = [];
    this._borderTiles = [];
    this._tilesToDestroy = [];

    this._borderTiles =
      this.parent.fieldAnalizer?.findTilesByModelName("start");
    if (playerModel == botModel) {
      currentTag = "player";
      motionForce = -8;
      this._borderTiles =
        this.parent.fieldAnalizer?.findTilesByModelName("end");
      addToRow = [-1, -2];
    }
    this.effectDurationValue = 1;
    this._cardsService = this.parent.cardsService;
    this._field = this.parent.field;

    if (this._cardsService == null) return false;
    if (this._field == null) return false;

    const countClosestTiles = (addToRow: number) => {
      this._borderTiles?.forEach((t) => {
        const row = t.row + addToRow;
        if (row >= 0 && row < matrix.rows) {
          const tile = matrix.get(row, t.col);
          if (tile.tileModel.containsTag(currentTag)) {
            this._tilesToRun?.push(tile);
            return;
          }
        }
      });
    };

    addToRow.forEach((i) => {
      countClosestTiles(i);
    });

    this._tilesToRun.forEach((tile) => {
      const tileForDel: TileController = matrix?.get(
        tile.row + motionForce,
        tile.col
      );
      this._tilesToDestroy?.push(tileForDel);
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
