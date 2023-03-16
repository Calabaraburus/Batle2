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
    const motionForce = 8;
    const matrix = this.parent.field?.fieldMatrix;
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
    this._tilesToRun = [];
    this._borderTiles = [];
    this._tilesToDestroy = [];

    this._borderTiles =
      this.parent.fieldAnalizer?.findTilesByModelName("start");

    const countClosestTiles = (addToRow: number) => {
      this._borderTiles?.forEach((t) => {
        const row = t.row - addToRow;
        if (row >= 0 && row < matrix.rows) {
          const tile = matrix.get(row, t.col);
          if (tile.tileModel.containsTag("enemy")) {
            this._tilesToRun?.push(tile);
            return;
          }
        }
      });
    };

    countClosestTiles(-1);
    countClosestTiles(-2);

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
