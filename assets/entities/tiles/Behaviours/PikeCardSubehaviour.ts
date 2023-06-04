import {
  randomRange,
  randomRangeInt,
  tween,
  UITransform,
  Vec2,
  Vec3,
} from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";
import { IAttackable, isIAttackable } from "../IAttackable";
import { ReadonlyMatrix2D } from "../../field/ReadonlyMatrix2D";
import { AnimationEffect } from "../../effects/AnimationEffect";

export class PikeCardSubehaviour extends CardsSubBehaviour {
  private _tilesToDestroy: TileController[] = [];
  private _colTilesToDestroy: TileController[] = [];
  private _cache: ObjectsCache | null;
  protected powerCard = 2;
  protected coordsCol = [
    [-2, -1, 1, 2],
    [-1, 1],
    [0, 0],
  ];
  private _targetTile: StdTileController;
  private _fieldTransform: UITransform;

  prepare(): boolean {
    let maxCountLength = this.powerCard;
    let maxCountLengthBot = 0;
    const coords = this.coordsCol.slice();
    this._targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();

    if (
      this.parent.cardsService?.getCurrentPlayerModel() ==
      this.parent.cardsService?._dataService?.botModel
    ) {
      maxCountLength = 0;
      maxCountLengthBot = this.powerCard;
      coords.reverse();
    }

    if (playerTag == null) return false;
    if (this.parent.cardsService == null) return false;

    if (this._targetTile instanceof StdTileController) {
      if (this._targetTile.tileModel.containsTag(playerTag)) {
        return false;
      }
    } else {
      return false;
    }

    const fieldTransform = this.parent.effectsNode?.getComponent(UITransform);

    if (fieldTransform == null) {
      console.log("[pike_cardsub][error] fieldTransform is null");
      return false;
    }

    this._fieldTransform = fieldTransform;
    const matrix = this.parent.field?.fieldMatrix;
    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 1.5;
    this._tilesToDestroy = [];
    this._colTilesToDestroy = [];

    this.parent.field?.fieldMatrix.forEachCol(
      this._targetTile.col,
      (tile, rowId) => {
        if (this.parent.cardsService == null) return;
        if (
          tile.tileModel.containsTag(this.parent.cardsService.getOponentTag())
        ) {
          if (
            this._targetTile.row + maxCountLength >= rowId &&
            this._targetTile.row - maxCountLengthBot <= rowId
          ) {
            this._colTilesToDestroy.push(tile);
          }
        }
      }
    );

    // let coords = [
    //   [-2, -1, 1, 2],
    //   [-1, 1],
    //   [0, 0],
    // ];

    // if (maxCountLength == 2 || maxCountLengthBot == 2) {
    //   coords = [
    //     [-2, -1, 1, 2],
    //     [-1, 1],
    //     [0, 0],
    //   ];
    // } else if (maxCountLength == 1 || maxCountLengthBot == 1) {
    //   coords = [
    //     [-1, 1],
    //     [0, 0],
    //   ];
    // } else {
    //   coords = [[0, 0]];
    // }

    for (let index = 0; index < this._colTilesToDestroy.length; index++) {
      this._tilesToDestroy.push(this._colTilesToDestroy[index]);
      this.getRowTiles(coords[index], this._colTilesToDestroy[index], matrix);
    }

    return true;
  }

  private getRowTiles(
    coords: number[],
    tile: TileController,
    matrix: ReadonlyMatrix2D<TileController> | undefined
  ) {
    coords.forEach((item) => {
      const tileToDestroy = matrix?.get(tile.row, tile.col + item);
      if (tile == tileToDestroy) return;
      if (!tileToDestroy) return;
      if (this.parent.cardsService == null) return;
      if (
        tileToDestroy.tileModel.containsTag(
          this.parent.cardsService.getOponentTag()
        )
      ) {
        this._tilesToDestroy.push(tileToDestroy);
      }
    });
  }

  run(): boolean {
    this._tilesToDestroy.forEach((item) => {
      if (isIAttackable(item)) {
        (<IAttackable>item).attack(1);
      } else {
        this.parent.field?.fakeDestroyTile(item);
      }
    });

    return true;
  }

  effect(): boolean {
    console.log("[pike_cardsub] start effect");

    const effects: CardEffect[] = [];

    const spareEffect =
      this._cache?.getObjectByPrefabName<AnimationEffect>("spareEffect");

    if (spareEffect == null) {
      return false;
    }

    const startPos = this._targetTile.node.position.clone();

    startPos.y = this._fieldTransform.height * this._fieldTransform.anchorY;

    spareEffect.node.parent = this._targetTile.node.parent;
    spareEffect.node.position = startPos;
    spareEffect.play();

    const animator = tween(spareEffect.node);

    this._tilesToDestroy.forEach((t, i) => {
      const effect =
        this._cache?.getObjectByPrefabName<CardEffect>("firewallEffect");
      if (effect == null) {
        return;
      }

      effect.node.position = t.node.position;
      effect.node.parent = this.parent.effectsNode;
      effect.stopEmmit();
      effects.push(effect);
    });

    animator
      .to(0.5, { position: this._targetTile.node.position })
      .call(() => effects.forEach((e) => e.play()))
      .delay(0.3)
      .call(() => {
        effects.forEach((e) => e.stopEmmit());
      })
      .delay(1)
      .call(() => {
        effects.forEach((e) => e.cacheDestroy());
        spareEffect.cacheDestroy();
      });

    animator.start();
    return true;
  }
}
