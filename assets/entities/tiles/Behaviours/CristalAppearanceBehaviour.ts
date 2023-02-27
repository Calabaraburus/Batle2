import {
  tween,
  _decorator,
  Node,
  director,
  randomRange,
  randomRangeInt,
  Tween,
} from "cc";
import { tagProperty } from "inversify/lib/annotation/decorator_utils";
import { PlayerModel } from "../../../models/PlayerModel";
import { helpers } from "../../../scripts/helpers";
import { GameBehaviour } from "../../behaviours/GameBehaviour";
import { CardEffect } from "../../effects/CardEffect";
import { CardService } from "../../services/CardService";
import { TileService } from "../../services/TileService";
import { StdTileController } from "../UsualTile/StdTileController";
import { FirewallCardSubehaviour } from "./FirewallCardSubehaviour";
import { ISubBehaviour } from "./ISubBehaviour";
import { LightningCardSubehaviour } from "./LightningCardSubehaviour";
import { ShieldCardSubehaviour } from "./shieldCardBehave";
const { ccclass, property } = _decorator;

@ccclass("CristalAppearanceBehaviour")
export class CristalAppearanceBehaviour extends GameBehaviour {
  private _effectsNode: Node | null;
  private _tilesService: TileService | null;
  public get effectsNode(): Node | null {
    return this._effectsNode;
  }

  private _turnsCountToCreateCristal = 3;

  private _turnCount = 3;

  @property(Node)
  startNode: Node;

  constructor() {
    super();
    this.type = helpers.typeName(StdTileController);
  }

  start() {
    super.start();
    this._tilesService = this.getService(TileService);
    const scene = director.getScene();
    if (scene != undefined) {
      this._effectsNode = scene.getChildByName("ParticleEffects");
    }
  }

  activateCondition(): boolean {
    if (this.gameManager?.changeGameState) return true;
  }

  singleRun(): void {
    //if (this._turnCount > this._turnsCountToCreateCristal) {
    this.createCristal();

    //    if (this.gameManager?.playerTurn) this._turnCount = 0;
    //  } else {
    //      if (this.gameManager?.playerTurn) this._turnCount += 1;
    //  }
  }

  createCristal() {
    const effect =
      this.objectsCache?.getObjectByPrefabName<CardEffect>(
        "magicEarningEffect"
      );

    if (effect == null) return;
    effect.node.parent = this.effectsNode;

    const tiles = this.gameManager?.playerTurn
      ? this._tilesService?.getEnemyTiles()
      : this._tilesService?.getPlayerTiles();

    if (tiles != null) {
      const tilesOfMyType = tiles.filter((t) => t instanceof StdTileController);
      const tileToActivate =
        tilesOfMyType[randomRangeInt(0, tilesOfMyType.length)];

      effect.node.position = this.startNode.position;

      effect.play();

      tween(effect.node)
        .to(1, { position: tileToActivate.node.position })
        .call(() => effect.stopEmmit())
        .delay(2)
        .call(() => effect.cacheDestroy())
        .start();
    }
  }
}
