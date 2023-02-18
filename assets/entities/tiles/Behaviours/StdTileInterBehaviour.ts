/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { director, _decorator } from "cc";
import { interfaces } from "inversify";
import { TileModel } from "../../../models/TileModel";
import { helpers } from "../../../scripts/helpers";
import { GameBehaviour } from "../../behaviours/GameBehaviour";
import { FieldAnalizer } from "../../field/FieldAnalizer";
import { GameManager } from "../../game/GameManager";
import { LevelController } from "../../level/LevelController";
import { CardService } from "../../services/CardService";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
const { ccclass } = _decorator;

/**
 * Implements behaviour for simple tiles
 */
@ccclass("StdTileInterBehaviour")
export class StdTileInterBehaviour extends GameBehaviour {
  private _cardsService: CardService | null;

  constructor() {
    super();
    this.type = helpers.typeName(StdTileController);
  }

  start() {
    super.start();
    this._cardsService = this.getService(CardService);
  }

  activateCondition(): boolean {
    const model = this._cardsService?.getCurrentPlayerModel();
    return model?.activeBonus == null;
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
    }

    this.debug?.log(`[behaviour][tilesBehaviour] update tile field`);
    this.updateTileField();

    this.debug?.log(`[behaviour][tilesBehaviour] lockUI`);
    this.gameManager?.lockUi();

    this.debug?.log(
      `[behaviour][tilesBehaviour] change game state to End turn`
    );
    this.gameManager?.changeGameState("endTurnEvent");
    this._inProcess = false;
  }

  private DestroyTile(tile: TileController): void {
    this.field?.fakeDestroyTile(tile);
  }

  private BeforeDestroy(tile: TileController): void {
    const tiles = [
      //tile.row + 1 < m?.rows ? m?.get(tile.row + 1, tile.col) : null,
      this.field?.fieldMatrix.get(tile.row - 1, tile.col),
    ];
  }

  private getTile(row: number, col: number): TileController | null {
    const m = this.field?.fieldMatrix;
    if (m == undefined) return null;
    //if(row>=m.rows | row<0 | col>=m.cols | )
    return null;
  }

  private tryToAttackTile(tile: TileController | null): void {
    if (tile == null) {
      return;
    }
  }

  manaUpdate(tilesCount: number, tileType: TileModel): void {
    const curPlayerModel = this._cardsService?.getCurrentPlayerModel();
    if (curPlayerModel == null) return;

    curPlayerModel.manaCurrent +=
      tilesCount > 6 ? (tilesCount > 10 ? 3 : 2) : 1;
  }
}
