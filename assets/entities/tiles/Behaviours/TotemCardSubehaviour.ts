//  fireWallCard - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { tween, randomRangeInt } from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { CardEffect } from "../../effects/CardEffect";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class TotemCardSubehaviour extends CardsSubBehaviour {
  private _tilesToTransform: TileController[] = [];
  private _cache: ObjectsCache | null;

  prepare(): boolean {
    this.parent.debug?.log("[totem_card_sub] Start preparing.");

    const totemCount = 3;
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardsService?.getPlayerTag();
    const enemyTag = this.parent.cardsService?.getOponentTag();

    if (playerTag == null || enemyTag == null) return false;
    if (this.parent.cardsService == null) return false;

    if (targetTile instanceof StdTileController) {
      if (targetTile.tileModel.containsTag(enemyTag)) {
        return false;
      }
    } else {
      return false;
    }

    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 0.5;
    this._tilesToTransform = [];

    const myTiles = this.parent.field?.fieldMatrix.filter((tile) => {
      return tile.tileModel.containsTag(playerTag);
    });

    if (myTiles == null) {
      this.parent.debug?.log("[totem_card_sub][error] myTiles is null.");

      return false;
    }

    for (let index = 0; index < totemCount; index++) {
      const rndId = randomRangeInt(0, myTiles.length);

      this._tilesToTransform.push(myTiles[rndId]);

      myTiles.splice(rndId, 1);
    }

    this.parent.debug?.log("[totem_card_sub] Prepared.");

    return true;
  }

  run(): boolean {
    this.parent.debug?.log("[totem_card_sub] Starting run.");

    const model = this.parent.field?.fieldModel.getTileModel("totem");

    if (model == undefined) {
      this.parent.debug?.log(
        "[totem_card_sub][error] Totem model is null. return false."
      );
      return false;
    }

    this._tilesToTransform.forEach((item) => {
      item.destroyTile();

      const pModel = this.parent.cardsService?.getCurrentPlayerModel();

      if (pModel == undefined || pModel == null) {
        this.parent.debug?.log(
          "[totem_card_sub][error] CurrentPlayerModel is null or undefined." +
            " return false."
        );
        return false;
      }

      this.parent.field?.createTile({
        row: item.row,
        col: item.col,
        tileModel: model,
        playerModel: pModel,
        position: item.node.position,
        putOnField: true,
      });
    });

    this.parent.debug?.log("[totem_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    this.parent.debug?.log("[totem_card_sub] start effect.");

    const effects: CardEffect[] = [];

    this._tilesToTransform.forEach((element) => {
      const effect =
        this._cache?.getObjectByPrefabName<CardEffect>("explosion2Effect");

      if (effect == null) {
        return false;
      }

      effect.node.position = element.node.position;
      effect.node.parent = this.parent.effectsNode;
      effect.play();

      effects.push(effect);
    });

    const animator = tween(this);
    animator.delay(1).call(() =>
      effects.forEach((ef) => {
        ef.cacheDestroy();
      })
    );

    animator.start();

    this.parent.debug?.log("[totem_card_sub] End with true.");
    return true;
  }
}
