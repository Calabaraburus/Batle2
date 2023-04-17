import { _decorator } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { ReadonlyMatrix2D } from "../field/ReadonlyMatrix2D";
import { TileController } from "../tiles/TileController";
import { StdTileController } from "../tiles/UsualTile/StdTileController";
import { DataService } from "./DataService";
import { Service } from "./Service";
const { ccclass } = _decorator;

@ccclass("TileService")
export class TileService extends Service {
  _dataService: DataService | null;
  // matrix: ReadonlyMatrix2D<TileController> | undefined;

  start() {
    this._dataService = this.getService(DataService);
  }

  public prepareForNewTurn() {
    this._dataService?.field?.fieldMatrix.forEach((t) =>
      this.prepareTileForNewTurn(t)
    );
  }

  private prepareTileForNewTurn(tile: TileController) {
    return true;
  }

  public getTilesByTagInColumn(colId: number, tag: string) {
    const tiles: TileController[] = [];
    this._dataService?.field?.fieldMatrix.forEachCol(colId, (t) => {
      if (t.tileModel.containsTag(tag)) {
        tiles.push(t);
      }
    });

    return tiles;
  }

  public getTilesInColumn(
    colId: number,
    filtFunc: (val: TileController) => boolean
  ) {
    const tiles: TileController[] = [];
    this._dataService?.field?.fieldMatrix.forEachCol(colId, (t) => {
      if (filtFunc(t)) {
        tiles.push(t);
      }
    });

    return tiles;
  }

  public getTilesInRow(
    targetTile: TileController,
    rowId: number,
    power: number,
    filtFunc: (val: TileController) => boolean
  ) {
    const tiles: TileController[] = [];
    this._dataService?.field?.fieldMatrix.forEachInRow(rowId, (t, colId) => {
      if (targetTile.col + power >= colId && targetTile.col - power <= colId) {
        if (filtFunc(t)) {
          tiles.push(t);
        }
      }
    });

    return tiles;
  }

  public getIdenticalTiles(
    targetTile: TileController,
    distanceMatrix: number[][],
    filtFunc: (val: TileController) => boolean
  ) {
    let tilesWeight = 0;
    const matrix = this._dataService?.field?.fieldMatrix;
    if (matrix == undefined) return;
    distanceMatrix.forEach((coordinates) => {
      const tile = matrix.get(
        targetTile.row + coordinates[1],
        targetTile.col + coordinates[0]
      );
      if (tile) {
        if (filtFunc(tile)) {
          const w = this.checkCoordinates(
            tile,
            distanceMatrix,
            targetTile,
            filtFunc
          );
          if (w == undefined) return;
          if (w[1] == 3) {
            tilesWeight = tilesWeight + 1;
          }
        }
      }
    });

    return tilesWeight;
  }

  public getDifferentTiles(
    targetTile: TileController,
    distanceMatrix: number[][],
    filtFunc: (val: TileController) => boolean
  ) {
    let tilesWeight = 0;
    const matrix = this._dataService?.field?.fieldMatrix;
    if (matrix == undefined) return;
    distanceMatrix.forEach((coordinates) => {
      const tile = matrix.get(
        targetTile.row + coordinates[1],
        targetTile.col + coordinates[0]
      );
      if (tile) {
        if (filtFunc(tile)) {
          const w = this.checkCoordinates(
            tile,
            distanceMatrix,
            targetTile,
            filtFunc
          );
          if (w == undefined) return;
          if (w[0] == 3) {
            tilesWeight = tilesWeight + 1;
          }
        } else if (!filtFunc(tile)) {
          tilesWeight = tilesWeight + 1;
        }
      } else if (tile == undefined) {
        tilesWeight = tilesWeight + 1;
      }
    });

    return tilesWeight;
  }

  private checkCoordinates(
    tile: TileController,
    coordinates: number[][],
    targetTile: TileController,
    filtFunc: (val: TileController) => boolean
  ) {
    // weight
    const matrix = this._dataService?.field?.fieldMatrix;
    if (matrix == undefined) return;
    //for different
    let wDifferent = 0;
    //for same
    let wSame = 0;
    coordinates.forEach((coord) => {
      const tileCheck = matrix.get(tile.row + coord[1], tile.col + coord[0]);
      if (tileCheck) {
        if (filtFunc(tileCheck)) {
          if (tileCheck.tileModel.tileId != targetTile.tileModel.tileId) {
            if (tile.tileModel.tileName != tileCheck?.tileModel.tileName) {
              wDifferent = wDifferent + 1;
            }
          } else if (tile.tileModel.tileName == tileCheck?.tileModel.tileName) {
            wSame = wSame + 1;
          }
        } else if (!filtFunc(tileCheck)) {
          wDifferent = wDifferent + 1;
        }
      } else if (tileCheck == undefined) {
        wDifferent = wDifferent + 1;
      }
    });
    return [wDifferent, wSame];
  }

  public getMatrixOfTiles(
    currentTile: TileController,
    targetCol: number,
    filtFunc: (val: TileController) => boolean
  ) {
    const tilesMatrix: TileController[] = [];
    const matrix = this._dataService?.field?.fieldMatrix;
    if (matrix == undefined) return;
    matrix.forEachCol(targetCol, (tile, rowId) => {
      if (tile) {
        if (filtFunc(tile)) {
          if (currentTile.row + 1 >= rowId && currentTile.row - 1 <= rowId) {
            tilesMatrix.push(tile);
          }
        }
      }
    });
    return tilesMatrix;
  }

  public getTilesByTag(tag: string): TileController[] {
    const result = this._dataService?.field?.fieldMatrix.filter((t) =>
      t.tileModel.containsTag(tag)
    );

    return result == null ? [] : result;
  }

  public getTiles(
    filtFunc: (val: TileController) => boolean
  ): TileController[] {
    const result = this._dataService?.field?.fieldMatrix.filter(filtFunc);

    return result == null ? [] : result;
  }

  public getPlayerTiles(): TileController[] {
    return this.getTiles(
      (t) => t.playerModel == this._dataService?.playerModel
    );
  }

  public getEnemyTiles(): TileController[] {
    return this.getTiles((t) => t.playerModel == this._dataService?.botModel);
  }

  public countShielded(tiles: Set<TileController>, shielded = true): number {
    let result = 0;
    tiles.forEach((t) => {
      if (t instanceof StdTileController) {
        if (shielded ? !t.shieldIsActivated : t.shieldIsActivated) {
          result++;
        }
      }
    });

    return result;
  }

  public countSame(tiles: Set<TileController>): number {
    let result = 0;
    tiles.forEach((t) => {
      if (t instanceof StdTileController) {
        result++;
      }
    });

    return result;
  }
}
