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

export class PikeCardSubehaviour extends CardsSubBehaviour {
  private _tilesToDestroy: TileController[] = [];
  private _colTilesToDestroy: TileController[] = [];
  private _cache: ObjectsCache | null;
  protected powerCard = 2;
  private _targetTile: StdTileController;
  private _fieldTransform: UITransform;

  prepare(): boolean {
    const maxCountLength = this.powerCard;
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
            this._targetTile.row <= rowId
          ) {
            this._colTilesToDestroy.push(tile);
          }
        }
      }
    );

    let coords = [
      [-2, -1, 1, 2],
      [-1, 1],
      [0, 0],
    ];

    if (maxCountLength == 1) {
      coords = [
        [-1, 1],
        [0, 0],
      ];
    } else if (maxCountLength == 0) {
      coords = [[0, 0]];
    }

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
