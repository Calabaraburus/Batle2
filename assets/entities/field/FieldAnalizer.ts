//  FieldAnalizer.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { FieldModel } from "../../models/FieldModel";
import { PlayerModel } from "../../models/PlayerModel";
import { TileController } from "../tiles/TileController";
import { AnalizedData, TileTypeToConnectedTiles } from "./AnalizedData";
import { ITileFieldController } from "./ITileFieldController";

/** Implement functions to analize different aspects of tile field.
 *  Find connected tiles, destroied, etc.
 */
export class FieldAnalizer {
  private _field: ITileFieldController;
  private _fieldModel: FieldModel;

  /** Constructor */
  constructor(field: ITileFieldController) {
    this._field = field;
    this._fieldModel = field.fieldModel;
  }

  /** Analize different aspects of tile field.
   *  Find connected tiles, destroied, etc.
   */
  public analize(): AnalizedData {
    const result = new AnalizedData();

    this._field.fieldMatrix.forEach((tile) => {
      if (
        tile.tileModel.tileName == "start" ||
        tile.tileModel.tileName == "empty" ||
        tile.tileModel.tileName == "end"
      ) {
        return;
      }

      if (tile.isDestroied) {
        result.destroiedTilesCount++;
        return;
      } else {
        result.aliveTilesCount++;

        if (tile.justCreated) {
          result.justCreatedTiles.push(tile);
        }
      }

      const set = new Set<TileController>();
      this.findConnectedTiles(tile, set);

      if (set.size > 1) {
        const tt = new TileTypeToConnectedTiles();
        tt.connectedTiles = set;
        tt.tileModel = tile.tileModel;
        tt.playerModel = tile.playerModel;
        result.connectedTiles.push(tt);
      } else {
        result.individualTiles.push(tile);
      }
    });

    return result;
  }

  /**
   * Get tiles that connected to each other
   * @param tile initial tile
   * @returns all connected tiles with same type
   */
  public getConnectedTiles(tile: TileController): TileController[] {
    const connectedTiles: Set<TileController> = new Set<TileController>();

    this.findConnectedTiles(tile, connectedTiles);

    return Array.from(connectedTiles.values());
  }

  /**
   * Find all connecticted tiles of same type
   * @param tile initial tile
   * @param resultSet set of connected tiles
   */
  public findConnectedTiles(
    tile: TileController,
    resultSet: Set<TileController>
  ) {
    const addTile = (current: TileController, other: TileController) => {
      if (current.tileTypeId == other.tileTypeId) {
        if (!resultSet.has(other)) {
          resultSet.add(other);
          this.findConnectedTiles(other, resultSet);
        }
      }
    };

    if (tile.row + 1 < this._fieldModel.rows) {
      addTile(tile, this._field.fieldMatrix.get(tile.row + 1, tile.col));
    }

    if (tile.row - 1 >= 0) {
      addTile(tile, this._field.fieldMatrix.get(tile.row - 1, tile.col));
    }

    if (tile.col + 1 < this._fieldModel.cols) {
      addTile(tile, this._field.fieldMatrix.get(tile.row, tile.col + 1));
    }

    if (tile.col - 1 >= 0) {
      addTile(tile, this._field.fieldMatrix.get(tile.row, tile.col - 1));
    }
  }

  public findTilesByModelName(name: string): TileController[] {
    const tileModel = this._field.fieldModel.getTileModel(name);
    return this._field.fieldMatrix.filter((t) => t.tileModel === tileModel);
  }

  public getAttackingTiles(
    tileNameToAttack: string,
    curPlayer: PlayerModel | null | undefined,
    ...tags: string[]
  ): TileController[] {
    const tilesToAtack = this.findTilesByModelName(tileNameToAttack);

    const result: TileController[] = [];

    const countClosestTiles = (addToRow: number) => {
      tilesToAtack.forEach((t) => {
        const row = t.row - addToRow;
        if (row >= 0 && row < this._field.fieldMatrix.rows) {
          const tile = this._field.fieldMatrix.get(row, t.col);

          if (tags == null || tags.length == 0) {
            if (tile.playerModel == curPlayer) {
              result.push(tile);
            }
          } else {
            tags.forEach((tag) => {
              if (
                tile.playerModel == curPlayer &&
                tile.tileModel.containsTag(tag)
              ) {
                result.push(tile);
                return;
              }
            });
          }
        }
      });
    };

    countClosestTiles(-1);
    countClosestTiles(1);

    return result;
  }
}
