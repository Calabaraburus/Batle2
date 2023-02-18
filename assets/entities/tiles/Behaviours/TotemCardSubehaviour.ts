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

    const totemCount = 4;
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
    this.effectDurationValue = 1.8;
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

      this.parent.field?.createTile({
        row: item.row,
        col: item.col,
        tileModel: model,
        position: item.node.position,
        putOnField: true,
      });
    });

    this.parent.debug?.log("[totem_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    //console.log("[cards][behaviour][totem] effect");
    //const timeObj = { time: 0 };
    //const animator = tween(timeObj);
    //const effects: CardEffect[] = [];
    //this._tilesToDestroy.forEach((t, i) => {
    //  const time = 0.1;
    //  animator.delay(i == 0 ? 0 : time).call(() => {
    //    const effect =
    //      this._cache?.getObjectByPrefabName<CardEffect>("firewallEffect");
    //    if (effect == null) {
    //      return;
    //    }
    //
    //    effect.node.position = t.node.position;
    //    effect.node.parent = this.parent.effectsNode;
    //    effect.play();
    //
    //    effects.push(effect);
    //  });
    //});
    //
    //animator
    //  .delay(0.5)
    //  .call(() => effects.forEach((e) => e.stopEmmit()))
    //  .delay(5)
    //  .call(() => effects.forEach((e) => e.cacheDestroy()));
    //
    //animator.start();
    return true;
  }
}
