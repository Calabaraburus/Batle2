import { randomRangeInt, tween } from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";
import { CardEffect } from "../../effects/CardEffect";

export class CatapultCardSubehaviour extends CardsSubBehaviour {
  private _tilesToTransform: TileController[] = [];
  private _cache: ObjectsCache | null;

  prepare(): boolean {
    this.parent.debug?.log("[catapult_card_sub] Start preparing.");

    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();
    const enemyTag = this.parent.cardsService?.getOponentTag();

    if (playerTag == null || enemyTag == null) return false;
    if (this.parent.cardsService == null) return false;

    if (targetTile instanceof StdTileController) {
      if (
        targetTile.playerModel == this.parent.cardsService?.getOponentModel()
      ) {
        return false;
      }
    } else {
      return false;
    }

    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 0.4;

    this.parent.debug?.log("[catapult_card_sub] Stop preparing with.");
    return true;
  }

  run(): boolean {
    this.parent.debug?.log("[catapult_card_sub] Starting run.");
    const targetTile = this.parent.target as StdTileController;

    const model = this.parent.field?.fieldModel.getTileModel("catapult");

    if (model == undefined) {
      this.parent.debug?.log(
        "[catapult_card_sub][error] Catapult model is null. return false."
      );
      return false;
    }

    const pModel = this.parent.cardsService?.getCurrentPlayerModel();

    if (pModel == undefined || pModel == null) {
      this.parent.debug?.log(
        "[catapult_card_sub][error] CurrentPlayerModel is null or undefined." +
          " return false."
      );
      return false;
    }

    targetTile.destroyTile();

    this.parent.field?.createTile({
      row: targetTile.row,
      col: targetTile.col,
      tileModel: model,
      playerModel: pModel,
      position: targetTile.node.position,
      putOnField: true,
    });

    this.parent.debug?.log("[catapult_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    const effect =
      this._cache?.getObjectByPrefabName<CardEffect>("explosion2Effect");

    if (effect == null) {
      return false;
    }

    effect.node.position = this.parent.target.node.position;
    effect.node.parent = this.parent.effectsNode;
    effect.play();

    this.parent.audio.playSoundEffect("catapult");

    const animator = tween(this);
    animator.delay(1).call(() => effect.cacheDestroy());

    animator.start();
    return true;
  }
}
