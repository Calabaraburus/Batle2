import { FieldModel } from '../../models/FieldModel';
import { TileController } from '../tiles/TileController';
import { AnalizedData, TileTypeToConnectedTiles } from './AnalizedData';
import { FieldController } from './FieldController';

/** Implement functions to analize different aspects of tile field.
 *  Find connected tiles, destroied, etc.
 */
export class FieldAnalizer {

  private _field: FieldController;
  private _fieldModel: FieldModel;

  /** Constructor */
  constructor(field: FieldController) {
    this._field = field;
    this._fieldModel = field.fieldModel;
  }

  /** Analize different aspects of tile field.
   *  Find connected tiles, destroied, etc.
   */
  public analize(): AnalizedData {
    const result = new AnalizedData();

    this._field.logicField.forEach((row, i) => {
      row.forEach((tile, i) => {

        if (tile.tileModel.tileName == "start" ||
          tile.tileModel.tileName == "empty" ||
          tile.tileModel.tileName == "end") {
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

        let set = new Set<TileController>();
        this.findConnectedTiles(tile, set);

        if (set.size > 1) {
          const tt = new TileTypeToConnectedTiles();
          tt.connectedTiles = set;
          tt.tileModel = tile.tileModel;
          result.connectedTiles.push(tt);
        } else {
          result.individualTiles.push(tile);
        }
      });
    });

    return result;
  }

  /**
    * Get tiles that connected to each other
    * @param tile initial tile
    * @returns all connected tiles with same type
    */
  public getConnectedTiles(tile: TileController): TileController[] {

    let connectedTiles: Set<TileController> = new Set<TileController>();

    this.findConnectedTiles(tile, connectedTiles);

    return Array.from(connectedTiles.values());
  }

  /**
  * Find all connecticted tiles of same type
  * @param tile initial tile
  * @param resultSet set of connected tiles
  */
  public findConnectedTiles(tile: TileController, resultSet: Set<TileController>) {

    let addTile = (current: TileController, other: TileController) => {

      if (current.tileTypeId == other.tileTypeId) {
        if (!resultSet.has(other)) {
          resultSet.add(other);
          this.findConnectedTiles(other, resultSet)
        }
      }
    }

    if (tile.row + 1 < this._fieldModel.rows) {
      addTile(tile, this._field.logicField[tile.row + 1][tile.col]);
    }

    if (tile.row - 1 >= 0) {
      addTile(tile, this._field.logicField[tile.row - 1][tile.col]);
    }

    if (tile.col + 1 < this._fieldModel.cols) {
      addTile(tile, this._field.logicField[tile.row][tile.col + 1]);
    }

    if (tile.col - 1 >= 0) {
      addTile(tile, this._field.logicField[tile.row][tile.col - 1]);
    }
  }
}


