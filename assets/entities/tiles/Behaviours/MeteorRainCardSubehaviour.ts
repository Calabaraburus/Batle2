import { randomRange, randomRangeInt, tween, UITransform, Vec2, Vec3 } from "cc";
import { lightning } from "../../effects/lightning";
import { Line } from "../../effects/Line";
import { CardService } from "../../services/CardService";
import { IAttackable, isIAttackable } from "../IAttackable";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";
import { ITileFieldController } from "../../field/ITileFieldController";
import { CardEffect } from "../../effects/CardEffect";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";


export class MeteorRainCardSubehaviour extends CardsSubBehaviour {
  protected maxCount = 3;
  protected powerCard = 1;
  private _cache: ObjectsCache | null;
  private _tilesToDestroy: TileController[] = [];
  private _targetTiles: TileController[] | undefined;
  private _cardsService: CardService | null;
  private _field: ITileFieldController | null | undefined;
  private _lightning: lightning | null;

  prepare(): boolean {
    const maxCountForEachSide = this.powerCard;
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardService.getPlayerTag();
    if (playerTag == null) return false;
    if (this.parent.cardService == null) return false;

    if (targetTile instanceof StdTileController) {
      if (targetTile.playerModel ==
        this.parent.cardService.getCurrentPlayerModel()) {
        return false;
      }
    } else {
      return false;
    }

    this.effectDurationValue = 1.5;
    this._cardsService = this.parent.cardService;
    this._field = this.parent.field;

    if (this._cardsService == null) return false;
    if (this._field == null) return false;
    this._targetTiles = [];

    const oponentModel = this._cardsService.getOponentModel();

    const oponentTiles = this._field.fieldMatrix.filter((tile) => {
      return tile.playerModel == oponentModel;
    });

    for (let index = 0; index < this.maxCount; index++) {
      this._targetTiles.push(
        oponentTiles[randomRangeInt(0, oponentTiles.length)]
      );
    }

    this._tilesToDestroy = [];

    this._targetTiles.forEach(tTile => {
      
    
    this.parent.field?.fieldMatrix.forEachCol(
      tTile.col,
      (tile, rowId) => {
        if (
          tile.playerModel == this.parent.currentOponentModel
        ) {
          if (
            tTile.row + maxCountForEachSide >= rowId &&
            tTile.row - maxCountForEachSide <= rowId
          ) {
            this._tilesToDestroy.push(tile);
          }
        }
      }
    );

    this.parent.field?.fieldMatrix.forEachInRow(
      tTile.row,
      (tile, colId) => {
        if (
          tile.playerModel == this.parent.currentOponentModel
        ) {
          if (
            tTile.col + maxCountForEachSide >= colId &&
            tTile.col - maxCountForEachSide <= colId
          ) {
            this._tilesToDestroy.push(tile);
          }
        }
      }
    );
  });

    return true;
  }

  run(): boolean {
    if (this._tilesToDestroy == undefined) return false;
    if (this._field == null) return false;

    this._tilesToDestroy.forEach((tile) => {
      if (isIAttackable(tile)) {
        (<IAttackable>tile).attack(1);
      } else {
        tile.fakeDestroy();
      }
    });

    return true;
  }

  effect(): boolean {
    console.log("[meteor_cardsub] start effect");

    const fieldTransform = this.parent.effectsNode?.getComponent(UITransform);

    if (fieldTransform == null) {
      console.log("[meteor_cardsub][error] fieldTransform is null");
      return false;
    }

    // const soundEffect = this.parent.
    const effects: CardEffect[] = [];

    const meteorEffect =
      this._cache?.getObjectByPrefabName<CardEffect>("meteorEffect");

    if (meteorEffect == null) {
      return false;
    }

    const border = [
      [
        -fieldTransform.width * fieldTransform.anchorX,
        fieldTransform.width * fieldTransform.anchorX,
      ],
      [
        -fieldTransform.height * fieldTransform.anchorY,
        fieldTransform.height * fieldTransform.anchorY,
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

    this.parent.audioManager.playSoundEffect("meteorite");

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

    this._targetTiles?.forEach(tTile =>{
      animator
      .to(0.5, { position: tTile.node.position })
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
    })
    
    return true;
  }
}
