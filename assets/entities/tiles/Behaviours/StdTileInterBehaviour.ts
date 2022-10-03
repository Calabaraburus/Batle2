/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { director, _decorator } from "cc";
import { helpers } from "../../../scripts/helpers";
import { GameBehaviour } from "../../behaviours/GameBehaviour";
import { FieldAnalizer } from "../../field/FieldAnalizer";
import { GameManager } from "../../game/GameManager";
import { LevelController } from "../../level/LevelController";
import { StdTileController } from "../UsualTile/StdTileController";
const { ccclass } = _decorator;

/**
 * Implements behaviour for simple tiles
 */
@ccclass("StdTileInterBehaviour")
export class StdTileInterBehaviour extends GameBehaviour {
  constructor() {
    super();
    this.type = helpers.typeName(StdTileController);
  }

  start() {
    super.start();
  }

  activateCondition(): boolean {
    return this.playerModel?.activeBonus == null;
  }

  singleRun(): void {
    const tile = this.target as StdTileController;

    if (tile.shieldIsActivated) {
      return;
    }

    const connectedTiles = this.fieldAnalizer?.getConnectedTiles(tile);

    if (connectedTiles == undefined) {
      return;
    }

    if (connectedTiles.length == 0) {
      return;
    }

    connectedTiles.forEach((item) => {
      if (item instanceof StdTileController) {
        if (!item.shieldIsActivated) {
          this.field?.fakeDestroyTile(item);
        }
      } else {
        this.field?.fakeDestroyTile(item);
      }
    });

    this.updateTileField();

    this.gameManager?.lockUi();

    this.gameManager?.changeGameState("endTurnEvent");
  }
}
