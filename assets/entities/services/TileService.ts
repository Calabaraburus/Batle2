import { _decorator } from "cc";
import { PlayerModel } from "../../models/PlayerModel";
import { TileController } from "../tiles/TileController";
import { StdTileController } from "../tiles/UsualTile/StdTileController";
import { DataService } from "./DataService";
import { Service } from "./Service";
const { ccclass } = _decorator;

@ccclass("TileService")
export class TileService extends Service {
  _dataService: DataService | null;

  start() {
    this._dataService = this.getService(DataService);
  }

  public prepareForNewTurn() {
    this._dataService?.field?.fieldMatrix.forEach((t) =>
      this.prepareTileForNewTurn(t)
    );
  }

  private prepareTileForNewTurn(tile: TileController) {
    if (tile instanceof StdTileController) {
      tile.activateShield(false);
    }
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
}
