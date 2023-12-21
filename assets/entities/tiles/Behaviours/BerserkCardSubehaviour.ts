import { randomRangeInt, tween } from "cc";
import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";
import { CardEffect } from "../../effects/CardEffect";
import { CardService } from "../../services/CardService";

export class BerserkCardSubehaviour extends CardsSubBehaviour {
  private _tilesToTransform: TileController[] = [];
  private _cache: ObjectsCache | null;
  private _cardsService: CardService | null;

  prepare(): boolean {
    this.parent.debug?.log("[berserk_card_sub] Start preparing.");

    const berserkCount = 2;
    let enemySide = 1;
    const targetTile = this.parent.target as StdTileController;
    const playerTag = this.parent.cardService.getPlayerTag();
    const enemyTag = this.parent.cardService.getOponentTag();

    if (
      this.parent.cardService.getCurrentPlayerModel() ==
      this.parent.botModel
    ) {
      enemySide = -1;
    }

    if (targetTile instanceof StdTileController) {
      if (
        targetTile.playerModel == this.parent.cardService.getOponentModel()
      ) {
        return false;
      }
    } else {
      return false;
    }

    if (targetTile.tileModel.specialTile) return false;

    const matrix = this.parent.field?.fieldMatrix;
    if (!matrix) return false;

    this._cache = ObjectsCache.instance;
    this.effectDurationValue = 0.5;
    this._tilesToTransform = [];

    const myPlayerTiles = this.parent.field?.fieldMatrix.filter((tile) => {
      return tile.tileModel.containsTag(playerTag);
    });

    if (myPlayerTiles == null) {
      this.parent.debug?.log("[berserk_card_sub][error] myTiles is null.");

      return false;
    }

    const myTiles: TileController[] | undefined = [];

    myPlayerTiles?.forEach((tile) => {
      const enemyTile = matrix.get(tile.row + enemySide, tile.col);
      if (enemyTile.tileModel.containsTag(enemyTag)) {
        myTiles.push(tile);
      }
    });

    if (myTiles == null) {
      this.parent.debug?.log("[berserk_card_sub][error] myTiles is null.");

      return false;
    }

    for (let index = 0; index < berserkCount; index++) {
      const rndId = randomRangeInt(0, myTiles.length);

      this._tilesToTransform.push(myTiles[rndId]);

      myTiles.splice(rndId, 1);
    }

    this.parent.debug?.log("[berserk_card_sub] Prepared.");

    return true;
  }

  run(): boolean {
    this.parent.debug?.log("[berserk_card_sub] Starting run.");

    const model = this.parent.field?.fieldModel.getTileModel("berserk");

    if (model == undefined) {
      this.parent.debug?.log(
        "[berserk_card_sub][error] berserk model is null. return false."
      );
      return false;
    }

    this._tilesToTransform.forEach((item) => {
      item.cacheDestroy();

      const pModel = this.parent.cardService.getCurrentPlayerModel();

      if (pModel == undefined || pModel == null) {
        this.parent.debug?.log(
          "[berserk_card_sub][error] CurrentPlayerModel is null or undefined." +
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

    this.parent.debug?.log("[berserk_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    this.parent.debug?.log("[berserk_card_sub] start effect.");

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

      this.parent.audioManager.playSoundEffect("berserk");

      effects.push(effect);
    });

    const animator = tween(this);
    animator.delay(1).call(() =>
      effects.forEach((ef) => {
        ef.cacheDestroy();
      })
    );

    animator.start();

    this.parent.debug?.log("[berserk_card_sub] End with true.");
    return true;
  }
}
