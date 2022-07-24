import { _decorator, Component, Node, UITransform, instantiate, Prefab, Vec3, director, color, randomRange, randomRangeInt } from 'cc';
import { math } from 'cc';
import { TileController } from '../tile/TileController';
import { FieldModel } from './FieldModel';
const { ccclass, property } = _decorator;

@ccclass('FieldController')
export class FieldController extends Component {

  @property({ type: [FieldModel], visible: true, tooltip: 'Field model' })
  fieldModel: FieldModel;

  @property(Prefab)
  tilePrefab: Prefab;

  @property(UITransform)
  tilesArea: UITransform;

  /**
   * Logic field (e.g. tiles matrix)
   */
  private _field: TileController[][];

  start() {
    this.generateTiles();
  }

  /**
   * Generate tile field
   */
  private generateTiles() {

    console.log("[field] Rows: " + this.fieldModel.Rows + " Cols: " + this.fieldModel.Cols);

    let stdTiles = this.fieldModel.getStandartTiles();

    this._field = [];

    for (let yIndex = 0; yIndex < this.fieldModel.Rows; yIndex++) {

      this._field[yIndex] = [];

      for (let xIndex = 0; xIndex < this.fieldModel.Rows; xIndex++) {

        let tileModel = stdTiles[randomRangeInt(0, stdTiles.length)];
        let tile = instantiate(this.tilePrefab);
        let tileTransform = tile.getComponent(UITransform);
        let tileController = tile.getComponent(TileController);
        tileController.setTile(tileModel);

        tileController.row = yIndex;
        tileController.col = xIndex;

        tileController.clickedEvent.on('TileController', this.tileClicked, this)

        let tW = this.tilesArea.width / this.fieldModel.Cols;
        let coef = tW / tileTransform.width;

        tileTransform.width = tW;
        tileTransform.height = tileTransform.height * coef;

        tile.position = new Vec3(xIndex * tW, yIndex * tW);
        tile.parent = this.node;

        this._field[yIndex][xIndex] = tileController;
      }
    }
  }

  /**
   * Method invokes when one of tiles is clicked
   * @param tile tile controller of clicked tile
   */
  private tileClicked(tile: TileController): void {

    console.log("[tile] clicked. Name: " + tile.tileModel.Name)

    let connectedTiles = this.getConnectedTiles(tile);
    connectedTiles.forEach(item => item.destroyTile());
  }

  /**
   * Get tiles that connected to each other
   * @param tile initial tile
   * @returns all connected tiles with same type
   */
  private getConnectedTiles(tile: TileController): TileController[] {

    let connectedTiles: Set<TileController> = new Set<TileController>();

    this.findConnectedTiles(tile, connectedTiles);

    return Array.from(connectedTiles.values());
  }

  /**
   * Find all connecticted tiles of same type
   * @param tile initial tile
   * @param resultSet set of connected tiles
   */
  private findConnectedTiles(tile: TileController, resultSet: Set<TileController>) {

    let addTile = (current: TileController, other: TileController) => {

      if (current.tileTypeId == other.tileTypeId) {
        if (!resultSet.has(other)) {
          resultSet.add(other);
          this.findConnectedTiles(other, resultSet)
        }
      }
    }

    if (tile.row + 1 < this.fieldModel.Rows) {
      addTile(tile, this._field[tile.row + 1][tile.col]);
    }

    if (tile.row - 1 >= 0) {
      addTile(tile, this._field[tile.row - 1][tile.col]);
    }

    if (tile.col + 1 < this.fieldModel.Cols) {
      addTile(tile, this._field[tile.row][tile.col + 1]);
    }

    if (tile.col - 1 >= 0) {
      addTile(tile, this._field[tile.row][tile.col - 1]);
    }
  }

  private moveTile(tile: TileController, col: number, row: number) {
    
  }

  update(deltaTime: number) {

  }
}