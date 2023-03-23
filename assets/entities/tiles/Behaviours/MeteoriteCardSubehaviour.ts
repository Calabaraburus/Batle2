import {
  random,
  randomRange,
  randomRangeInt,
  tween,
  UITransform,
  Vec2,
  Vec3,
  view,
} from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { LevelView } from "../../level/LevelView";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class MeteoriteCardSubehaviour extends CardsSubBehaviour {
  private _tilesToDestroy: TileController[] = [];
  private _cache: ObjectsCache | null;
  protected powerCard = 2;
  private _targetTile: StdTileController;
  private _fieldTransform: UITransform;

  prepare(): boolean {
    const maxCountForEachSide = this.powerCard;
    this._targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();

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
      console.log("[meteor_cardsub][error] fieldTransform is null");
      return false;
    }

    this._fieldTransform = fieldTransform;

    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 1.5;
    this._tilesToDestroy = [];

    this.parent.field?.fieldMatrix.forEachCol(
      this._targetTile.col,
      (tile, rowId) => {
        if (this.parent.cardsService == null) return;
        if (
          tile.tileModel.containsTag(this.parent.cardsService.getOponentTag())
        ) {
          if (
            this._targetTile.row + maxCountForEachSide >= rowId &&
            this._targetTile.row - maxCountForEachSide <= rowId
          ) {
            this._tilesToDestroy.push(tile);
          }
        }
      }
    );

    this.parent.field?.fieldMatrix.forEachInRow(
      this._targetTile.row,
      (tile, colId) => {
        if (this.parent.cardsService == null) return;
        if (
          tile.tileModel.containsTag(this.parent.cardsService.getOponentTag())
        ) {
          if (
            this._targetTile.col + maxCountForEachSide >= colId &&
            this._targetTile.col - maxCountForEachSide <= colId
          ) {
            this._tilesToDestroy.push(tile);
          }
        }
      }
    );

    return true;
  }

  run(): boolean {
    this._tilesToDestroy.forEach((item) =>
      this.parent.field?.fakeDestroyTile(item)
    );

    return true;
  }

  effect(): boolean {
    console.log("[meteor_cardsub] start effect");

    const effects: CardEffect[] = [];

    const meteorEffect =
      this._cache?.getObjectByPrefabName<CardEffect>("meteorEffect");

    if (meteorEffect == null) {
      return false;
    }

    const border = [
      [
        -this._fieldTransform.width * this._fieldTransform.anchorX,
        this._fieldTransform.width * this._fieldTransform.anchorX,
      ],
      [
        -this._fieldTransform.height * this._fieldTransform.anchorY,
        this._fieldTransform.height * this._fieldTransform.anchorY,
      ],
    ];

    const lines = [
      [
        [0, 0],
        [1, 0],
      ],
      [
        [0, 0],
        [0, 1],
      ],
      [
        [1, 1],
        [1, 0],
      ],
      [
        [1, 1],
        [0, 1],
      ],
    ];

    for (let index = 0; index < 100; index++) {
      const element = randomRangeInt(0, 2);
    }

    const line = lines[randomRangeInt(0, 4)];

    const point = new Vec2(
      randomRange(border[0][line[0][0]], border[1][line[0][1]]),
      randomRange(border[0][line[1][0]], border[1][line[1][1]])
    );

    meteorEffect.node.setPosition(new Vec3(point.x, point.y));
    meteorEffect.node.parent = this.parent.effectsNode;

    meteorEffect.play();

    const animator = tween(meteorEffect.node);

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
      .delay(0.5)
      .call(() => effects.forEach((e) => e.play()))
      .delay(0.3)
      .call(() => {
        meteorEffect.stopEmmit();
        effects.forEach((e) => e.stopEmmit());
      })
      .delay(1)
      .call(() => {
        effects.forEach((e) => e.cacheDestroy());
        meteorEffect.cacheDestroy();
      });

    animator.start();
    return true;
  }
}
