import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class AssassinCardSubehaviour extends CardsSubBehaviour {
  private _tilesToTransform: TileController[] = [];
  private _cache: ObjectsCache | null;

  prepare(): boolean {
    this.parent.debug?.log("[assassin_card_sub] Start preparing.");

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
    this.effectDurationValue = 1.8;

    return true;
  }

  run(): boolean {
    this.parent.debug?.log("[assassin_card_sub] Starting run.");
    const targetTile = this.parent.target as StdTileController;

    const model = this.parent.field?.fieldModel.getTileModel("assassin");

    if (model == undefined) {
      this.parent.debug?.log(
        "[assassin_card_sub][error] Catapult model is null. return false."
      );
      return false;
    }

    const pModel = this.parent.cardsService?.getCurrentPlayerModel();

    if (pModel == undefined || pModel == null) {
      this.parent.debug?.log(
        "[assassin_card_sub][error] CurrentPlayerModel is null or undefined." +
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

    this.parent.debug?.log("[assassin_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    return true;
  }
}
