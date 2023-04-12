import { random } from "cc";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { BotAnalizator } from "./BotAnalizator";
import { CardAnalizator } from "./CardAnalizator";
import {
  AnalizedData,
  TileTypeToConnectedTiles,
} from "../entities/field/AnalizedData";

export class PanicCardBotAnalizator extends CardAnalizator {
  resultTiles: TileTypeToConnectedTiles | null;
  // tileToInvoke: TileController | null;
  procentToInvoke = 0.7;
  private bonusName = "panic";

  decide() {
    if (this.bot.tileService == null) return;

    const card = this.getBonus(this.bonusName);
    if (card == null) return;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus: panic");

    const tiles = this.bot.tileService.getPlayerTiles();
    this.bot.pressTileArray(tiles);
  }

  analize(data: AnalizedData): number {
    console.log(`[Bot][panic] start analize`);
    this.weight = 0;
    if (this.bot.botModel == null) return 0;
    if (this.bot.tileService == null) return 0;
    const card = this.getBonus(this.bonusName);
    if (card == null) return 0;

    if (!this.canActivateCard(card)) return 0;

    this.resultTiles = this.getMaxConnected(data.connectedTiles);

    if (this.resultTiles == null) return 0;

    if (this.resultTiles.connectedTiles.size <= 0) return 0;

    const rnd = random();
    console.log(`[Bot][panic] decision value: ${rnd}`);
    if (this.resultTiles.connectedTiles.size <= 4) {
      this.weight = 1;
      return 1;
    } else if (
      rnd <= this.procentToInvoke &&
      this.resultTiles.connectedTiles.size > 4
    ) {
      this.weight = 1;
      return 1;
    }

    return 0;
    // this.tileToInvoke = null;
    // if (this.bot.tileService == null) return 0;
    // if (this.bot.botModel == null) return 0;
    // this.weight = 0;
    // const card = this.getBonus(this.bonusName);
    // if (card == null) return 0;

    // if (!this.canActivateCard(card)) return 0;
    // this.resultTiles = this.getMaxConnected(data.connectedTiles);

    // if (this.resultTiles == null) return 0;

    // if (this.resultTiles.connectedTiles.size <= 0) return 0;

    // const rnd = random();
    // if (
    //   rnd <= this.procentToInvoke &&
    //   this.resultTiles.connectedTiles.size <= 5
    // ) {
    //   const desision = random();
    //   this.weight = desision > 1 - this.procentToInvoke ? 1 : 0;
    // }

    // return this.weight;

    // this.tileToInvoke = null;
    // if (this.bot.tileService == null) return 0;
    // if (this.bot.botModel == null) return 0;
    // this.weight = 0;
    // const card = this.getBonus(this.bonusName);
    // if (card == null) return 0;

    // if (!this.canActivateCard(card)) return 0;

    // const tService = this.bot.tileService;
    // if (tService == undefined) return 0;

    // const weightedTilesList: { weight: number; tile: TileController }[] = [];

    // const playerModel = this.bot.dataService?.playerModel;

    // let tilesMatrix: TileController[] | undefined = [];

    // let coefType = 0;

    // for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
    //   const tilesInCol = this.bot.tileService
    //     .getTilesInColumn(index, (t) => t.playerModel == playerModel)
    //     .filter((t) => {
    //       if (t instanceof StdTileController) {
    //         return !t.shieldIsActivated;
    //       } else {
    //         return true;
    //       }
    //     });

    //   const ids = [-1, 0, 1];

    //   tilesInCol.forEach((tile) => {
    //     tilesMatrix = [];
    //     ids.forEach((i) => {
    //       const tilesCol = tService.getMatrixOfTiles(
    //         tile,
    //         tile.col + i,
    //         (t) => t.playerModel == playerModel
    //       );
    //       if (tilesCol != undefined) {
    //         tilesMatrix = tilesMatrix?.concat(tilesCol);
    //       }
    //     });
    //     const amountTileTypes: number[] = [0, 0, 0];
    //     if (tilesMatrix == undefined) return;
    //     tilesMatrix.forEach((t) => {
    //       if (t.tileModel.tileName == "b") {
    //         amountTileTypes[0] += 1;
    //       } else if (t.tileModel.tileName == "g") {
    //         amountTileTypes[1] += 1;
    //       } else if (t.tileModel.tileName == "k") {
    //         amountTileTypes[2] += 1;
    //       }
    //     });
    //     if (
    //       Math.min(...amountTileTypes) != 0 &&
    //       Math.max(...amountTileTypes) <= 5
    //     ) {
    //       coefType = 0.8;
    //     } else {
    //       coefType = 0;
    //     }

    //     const coef =
    //       Math.exp(-1 * ((tilesMatrix.length - 8) / 9) ** 2) * coefType;

    //     if (tilesMatrix.length >= 5) {
    //       const tileToInvoke =
    //         tilesInCol[Math.ceil((tilesInCol.length - 1) / 2)];
    //       weightedTilesList.push({ weight: coef, tile: tileToInvoke });
    //     }
    //   });
    // }
    // this.resultTiles = this.getMaxConnected(data.connectedTiles);

    // if (this.resultTiles == null) return 0;

    // if (this.resultTiles.connectedTiles.size <= 0) return 0;

    // // const rnd = random();
    // if (this.resultTiles.connectedTiles.size <= 5) {
    //   const res = weightedTilesList.sort(
    //     (t1, t2) => -(t1.weight - t2.weight)
    //   )[0];
    //   if (res == null) return 0;

    //   this.tileToInvoke = res.tile;
    //   const desision = random();
    //   this.weight = desision > 1 - this.procentToInvoke ? 1 : 0;
    // }

    // return this.weight;
  }

  private getMaxConnected(
    connects: TileTypeToConnectedTiles[]
  ): TileTypeToConnectedTiles | null {
    return connects
      .filter((c) => c.tileModel.containsTag("player"))
      .reduce(
        (acc, connect) =>
          (acc =
            this.bot.tileService!.countSame(acc.connectedTiles) >
            this.bot.tileService!.countSame(connect.connectedTiles)
              ? acc
              : connect),
        connects[0]
      );
  }
}
