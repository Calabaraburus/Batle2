/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { tween, _decorator, Node, director } from "cc";
import { PlayerModel } from "../../../models/PlayerModel";
import { helpers } from "../../../scripts/helpers";
import { GameBehaviour } from "../../behaviours/GameBehaviour";
import { CardService } from "../../services/CardService";
import { StdTileController } from "../UsualTile/StdTileController";
import { BodyExchangeCardSubehaviour } from "./BodyExchangeCardSubehaviour";
import { FirewallCardSubehaviour } from "./fireWallCard";
import { ISubBehaviour } from "./ISubBehaviour";
import { LightningCardSubehaviour } from "./lightningCard";
import { ShieldCardSubehaviour } from "./shieldCardBehave";
const { ccclass } = _decorator;

@ccclass("CardsBehaviour")
export class CardsBehaviour extends GameBehaviour {
  private _cardsRunDict = new Map<string, ISubBehaviour>();
  private _cardsService: CardService | null;
  private _effectsNode: Node | null;

  public get effectsNode(): Node | null {
    return this._effectsNode;
  }
  public get cardsService() {
    return this._cardsService;
  }

  constructor() {
    super();
    this.type = helpers.typeName(StdTileController);

    this._cardsRunDict.set("firewall", new FirewallCardSubehaviour(this));
    this._cardsRunDict.set("lightning", new LightningCardSubehaviour(this));
    this._cardsRunDict.set("shield", new ShieldCardSubehaviour(this));
    this._cardsRunDict.set(
      "bodyExchange",
      new BodyExchangeCardSubehaviour(this)
    );
  }

  start() {
    super.start();
    const scene = director.getScene();
    if (scene != undefined) {
      this._effectsNode = scene.getChildByName("ParticleEffects");
    }

    this._cardsService = this.getService(CardService);
  }

  activateCondition(): boolean {
    const model = this._cardsService?.getCurrentPlayerModel();
    return model != null ? model.activeBonus != null : false;
  }

  singleRun(): void {
    if (this.target == undefined) {
      throw Error("[behaviour][cardsBehaviour] tile cant be undefined");
    }
    console.log("cardsSingleRun___________________");
    this._inProcess = true;
    const model = this._cardsService?.getCurrentPlayerModel();
    const mnemonic = model?.activeBonus?.mnemonic;
    if (mnemonic == null) return;

    if (this._cardsRunDict.has(mnemonic)) {
      const subBehave = this._cardsRunDict.get(mnemonic);

      if (subBehave != undefined) {
        if (subBehave.prepare()) {
          subBehave.effect();

          tween(this)
            .delay(subBehave.effectDuration)
            .call(() => {
              if (subBehave.run()) {
                this.finalize();
              }
            })
            .start();
        }
      }
    }
  }

  finalize(): void {
    const model = this._cardsService?.getCurrentPlayerModel();

    if (model != null) {
      this.payCardPrice(model);
      model.activeBonus!.alreadyUsedOnTurn = true;
      this.deactivateBonus(model);
    }

    this.levelController?.updateData();

    this.updateTileField();
    this._inProcess = false;
  }

  payCardPrice(model: PlayerModel): void {
    model.activeBonus!.currentAmmountToActivate -=
      model.activeBonus!.priceToActivate;
  }

  deactivateBonus(model: PlayerModel) {
    model.unSetBonus();
  }
}
