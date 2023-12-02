/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { director, _decorator } from "cc";
import { interfaces } from "inversify";
import { TileModel } from "../../../models/TileModel";
import { helpers } from "../../../scripts/helpers";
import { GameBehaviour } from "../../behaviours/GameBehaviour";
import { FieldAnalyzer } from "../../field/FieldAnalizer";
import { GameManager } from "../../game/GameManager";
import { LevelController } from "../../level/LevelController";
import { CardService } from "../../services/CardService";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { IAttackable, isIAttackable } from "../IAttackable";
import { LevelModel } from "../../../models/LevelModel";
import { MatchStatisticService } from "../../services/MatchStatisticService";

const { ccclass } = _decorator;

/**
 * Implements behaviour for simple tiles
 */
@ccclass("StdTileInterBehaviour")
export class StdTileInterBehaviour extends GameBehaviour {
  //private _cardsService: CardService | null;

  //  start() {
  // super.start();
  // this._cardsService = this.getService(CardService);
  // this._levelModel = this.getService(LevelModel);
  // this._matchStatistic = this.getService(MatchStatisticService);
  //}
  constructor() {
    super();
    this.type = helpers.typeName(StdTileController);
  }

  singleRun(): void {
    this.debug?.log(`[behaviour][tilesBehaviour] stop iterate over behaves`);

    this._inProcess = true;
    const tile = this.target as StdTileController;

    if (tile == undefined || tile == null) {
      throw Error("[behaviour][tileBehaviour] tile cant be undefined or null");
    }

    if (tile.shieldIsActivated) {
      return;
    }

    this.debug?.log(
      `[behaviour][tilesBehaviour] try to get connected tiles for r:${tile.row}, c:${tile.col}`
    );

    const connectedTiles = this.fieldAnalizer?.getConnectedTiles(tile);

    if (connectedTiles == undefined || connectedTiles == null) {
      this.debug?.log(
        `[behaviour][tilesBehaviour] Error connected tiles is null or undefined`
      );
      return;
    }

    if (connectedTiles.length == 0) {
      this.debug?.log(
        `[behaviour][tilesBehaviour] there is no connected tiles`
      );

      return;
    }

    this.debug?.log(`[behaviour][tilesBehaviour] try to destroy tiles`);

    let tilesCount = 0;

    connectedTiles.forEach((item) => {
      if (item instanceof StdTileController) {
        if (!item.shieldIsActivated) {
          this.BeforeDestroy(item);
          this.DestroyTile(item);

          tilesCount++;
        }
      } else {
        //this.field?.fakeDestroyTile(item);
      }
    });

    if (tilesCount > 0) {
      this.manaUpdate(tilesCount, connectedTiles[0].tileModel);
      this.eotInvoker.endTurn();
      /*      this._matchStatistic?.updateTapTileStatistic(
              tilesCount,
              connectedTiles[0].tileModel
            );*/
    }

    this.debug?.log(`[behaviour][tilesBehaviour] update tile field`);
    this.updateTileField();

    // this.gameManager?.changeGameState("endTurnEvent");
    this._inProcess = false;
  }

  private DestroyTile(tile: TileController): void {
    this.field?.fakeDestroyTile(tile);
  }

  private BeforeDestroy(tile: TileController): void {
    const tiles = [
      this.getTile(tile.row + 1, tile.col),
      this.getTile(tile.row - 1, tile.col),
      this.getTile(tile.row, tile.col + 1),
      this.getTile(tile.row, tile.col - 1),
    ];

    tiles.forEach((t) => {
      if (isIAttackable(t)) {
        if (t.playerModel == this.currentOponentModel) {
          (<IAttackable>t).attack(1);
        }
      }
    });
  }

  private getTile(row: number, col: number): TileController | null {
    const m = this.field?.fieldMatrix;
    if (m == undefined) {
      return null;
    }

    if (row >= m.rows || row < 0 || col >= m.cols || col < 0) {
      return null;
    }

    return m.get(row, col);
  }

  private updateTileField() {
    const analizedData = this.fieldAnalizer?.analyze();

    if (analizedData != null) {
      this.field?.moveTilesLogicaly(!this.gameState.isPlayerTurn);
      this.field?.fixTiles();
      this.field?.flush();
    }
  }


  manaUpdate(tilesCount: number, tileType: TileModel): void {
    const curPlayerModel = this.currentPlayerModel;
    if (curPlayerModel == null) return;
    if (this.levelModel.gameMechanicType == 0) {
      curPlayerModel.manaCurrent +=
        tilesCount > 6 ? (tilesCount > 10 ? 3 : 2) : 1;
    } else {
      const tbonuses = curPlayerModel.bonuses.filter((b) =>
        tileType.containsTag(b.activateType)
      );

      tbonuses.forEach(
        (b) =>
        (b.currentAmmountToActivate +=
          tilesCount > 6 ? (tilesCount > 10 ? 3 : 2) : 1)
      );
    }
  }
}
