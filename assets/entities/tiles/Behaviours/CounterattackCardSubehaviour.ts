import { assert, randomRange, randomRangeInt } from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { FieldController } from "../../field/FieldController";
import { CardService } from "../../services/CardService";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";
import { AnimationEffect } from "../../effects/AnimationEffect";
import { ReadonlyMatrix2D } from "../../field/ReadonlyMatrix2D";
import { IAttackable, isIAttackable } from "../IAttackable";

export class CounterattackCardSubehaviour extends CardsSubBehaviour {
  private _cache: ObjectsCache;
  private _cardsService: CardService | null;
  private _field: FieldController | null | undefined;
  private _tilesToDestroy: TileController[] | undefined;
  private _matrix: ReadonlyMatrix2D<TileController>;
  private _rndColumns: number[] = [];

  prepare(): boolean {
    const targetTile = this.parent.target as StdTileController;

    let targetRow = 10;
    let vectorPuch = -1;
    if (
      this.parent.cardsService?.getCurrentPlayerModel() ==
      this.parent.cardsService?._dataService?.botModel
    ) {
      targetRow = 1;
      vectorPuch = 1;
    }
    if (this.parent.field?.fieldMatrix == null) return false;
    this._matrix = this.parent.field?.fieldMatrix;
    if (this.parent.cardsService == null) return false;

    this.effectDurationValue = 1;
    this._cardsService = this.parent.cardsService;
    this._field = this.parent.field;

    if (this._cardsService == null) return false;
    if (this._field == null) return false;
    this._tilesToDestroy = [];

    const columnNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    while (this._rndColumns.length < 5) {
      const item =
        columnNumbers[Math.floor(Math.random() * columnNumbers.length)];
      this._rndColumns.push(item);
      columnNumbers.splice(columnNumbers.indexOf(item), 1);
    }

    this._matrix.forEachInRow(targetRow, (tile, colId) => {
      if (this._rndColumns.indexOf(tile.col) > -1) {
        if (tile.playerModel == this.parent.cardsService?.getOponentModel()) {
          if (tile instanceof StdTileController) {
            !tile.shieldIsActivated;
            this._tilesToDestroy?.push(tile);
          }
        }
        const nextTile = this._matrix.get(tile.row + vectorPuch, tile.col);
        if (
          nextTile.playerModel == this.parent.cardsService?.getOponentModel()
        ) {
          if (tile instanceof StdTileController) {
            !tile.shieldIsActivated;
            this._tilesToDestroy?.push(nextTile);
          }
        }
      }
    });

    assert(ObjectsCache.instance, "Cache is null");

    this._cache = ObjectsCache.instance;

    return true;
  }

  run(): boolean {
    if (!this._tilesToDestroy) return false;
    this._tilesToDestroy.forEach((tile) => {
      console.log(tile.row);
      console.log(tile.col);
      console.log("-----");
      if (isIAttackable(tile)) {
        (<IAttackable>tile).attack(1);
      } else {
        this.parent.field?.fakeDestroyTile(tile);
      }
    });

    return true;
  }

  effect(): boolean {
    this.parent.debug?.log("[push_card_sub] Start effect.");
    const curPlayer = this.parent.cardsService?.getCurrentPlayerModel();

    this.parent.audio.playSoundEffect("motivate");

    this._matrix.forEach((tile) => {
      if (tile.playerModel != curPlayer) return;

      const effect =
        this._cache?.getObjectByPrefabName<AnimationEffect>("motivateEffect");

      if (effect == null) {
        return false;
      }
      effect.node.parent = tile.node.parent;
      effect.node.position = tile.node.position;
      effect.node.scale = tile.node.scale;
      effect.play();
    });

    this.parent.debug?.log("[push_card_sub] End effect.");

    return true;
  }
}
