import { _decorator, Component, Node, UITransform, instantiate, Prefab, Vec3, director, color, randomRange, randomRangeInt, ForwardStage, find, WorldNode3DToLocalNodeUI, Vec2, SceneAsset } from 'cc';
import { math } from 'cc';
import { TileController } from '../tile/TileController';
import { TileModel } from '../tile/TileModel';
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
    this.analizeTiles();
  }

  /**
   * Generate tile field
   */
  private generateTiles() {

    console.log("[field] Rows: " + this.fieldModel.rows + " Cols: " + this.fieldModel.cols);

    this._field = [];

    const map = this.fieldModel.getFieldMap();

    for (let yIndex = 0; yIndex < this.fieldModel.rows; yIndex++) {

      this._field[yIndex] = [];

      for (let xIndex = 0; xIndex < this.fieldModel.rows; xIndex++) {

        let tileModel = this.fieldModel.getTileModelByMapMnemonic(map[yIndex][xIndex]);
        let tile = this.createTile(yIndex, xIndex, tileModel);

        this._field[yIndex][xIndex] = tile;
      }
    }
  }

  private createTile(row: number, col: number, tileModel: TileModel, position: Vec3 = null): TileController {
    let tile = instantiate(this.tilePrefab);

    let tileController = tile.getComponent(TileController);

    tileController.setTile(tileModel);

    tileController.row = row;
    tileController.col = col;

    tileController.clickedEvent.on('TileController', this.tileClicked, this)

    var tPos = this.calculateTilePosition(row, col);

    tile.position = position == null ? tPos : position;
    tile.parent = this.node;

    const size = this.calculateTileSize(tile);

    tile.scale = size;

    return tileController;
  }

  private calculateTilePosition(row: number, col: number): Vec3 {
    let tW = this.tilesArea.width / this.fieldModel.cols;
    return new Vec3(col * tW, row * tW);
  }

  private calculateTileSize(tile: Node): Vec3 {
    let tileTransform = tile.getComponent(UITransform);
    let tW = this.tilesArea.width / this.fieldModel.cols;
    let coef = tW / tileTransform.width;

    return new Vec3(coef, coef, tile.scale.z);
  }

  /**
   * Method invokes when one of tiles is clicked
   * @param tile tile controller of clicked tile
   */
  private tileClicked(tile: TileController): void {

    console.log("[tile] clicked. Name: " + tile.tileModel.Name)

    let connectedTiles = this.getConnectedTiles(tile);

    connectedTiles.forEach(item => item.destroyTile());

    for (let index = 0; index < this.fieldModel.cols; index++) {
      this.moveAllTilesOnARote(index);

    }

    this.analizeTiles();
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

    if (tile.row + 1 < this.fieldModel.rows) {
      addTile(tile, this._field[tile.row + 1][tile.col]);
    }

    if (tile.row - 1 >= 0) {
      addTile(tile, this._field[tile.row - 1][tile.col]);
    }

    if (tile.col + 1 < this.fieldModel.cols) {
      addTile(tile, this._field[tile.row][tile.col + 1]);
    }

    if (tile.col - 1 >= 0) {
      addTile(tile, this._field[tile.row][tile.col - 1]);
    }
  }

  private moveAllTilesOnARote(roteId: number) {
    const startTile = this.getStartTile(roteId);
    const endTile = this.getEndTile(roteId);
    const emptyModel = this.fieldModel.getTileModel("empty");

    if (startTile == null || endTile == null) { return; }

    const findTiles = (destroied: boolean): TileController[] => {

      let res: TileController[] = [];

      this._field.forEach(row => {
        if (row[roteId].isDestroied == destroied &&
          (row[roteId] != startTile &&
            row[roteId] != endTile &&
            row[roteId].tileTypeId != emptyModel.Id)) {
          res.push(row[roteId]);
        }
      });

      return res;
    }

    const fwd = endTile.row > startTile.row;
    const destroiedTiles = findTiles(true);

    if (destroiedTiles.length == 0) {
      return;
    }

    const stdTileModels = this.fieldModel.getStandartTiles();

    let pathTiles = [];

    // add new tiles
    for (let index = 0; index < destroiedTiles.length; index++) {
      let tileRowId = fwd ? startTile.row + 1 + index : startTile.row - 1 - index;
      let yPosIndex = fwd ? startTile.row - 1 - index : startTile.row + 1 + index;
      var tile = this.createTile(tileRowId,
        roteId,
        stdTileModels[randomRangeInt(0, stdTileModels.length)],
        this.calculateTilePosition(yPosIndex, startTile.col));

      pathTiles[fwd ? index : destroiedTiles.length - index - 1] = tile;
    }

    var liveTiles = findTiles(false);
    liveTiles.forEach((t, i) => {
      pathTiles[destroiedTiles.length + (fwd ? i : (liveTiles.length - i - 1))] = t;
    });

    pathTiles.forEach((t: TileController, i) => {
      let tileRowId = fwd ? startTile.row + 1 + i : startTile.row - 1 - i;
      t.row = tileRowId;

      this._field[t.row][t.col] = t;

      this.moveTile(t, this.calculateTilePosition(t.row, t.col));
    });
  }

  private analizeTiles() {

    this.PrepareTilesForAnalize();

    this._field.forEach((row, i) => {
      row.forEach((tile, i) => {
        let set = new Set<TileController>();
        this.findConnectedTiles(tile, set);

        this.AnalizeConnects(set);
      });
    });
  }

  private AnalizeConnects(set: Set<TileController>) {

    set.forEach(tile => {
      if (tile.tileAnalized) {
        return;
      }

      if (set.size >= this.fieldModel.quantityToStar) {
        tile.setStar();
      } else if (set.size >= this.fieldModel.quantityToBomb) {
        tile.setBomb();
      } else if (set.size >= this.fieldModel.quantityToRocket) {
        tile.setRocket();
      }

      tile.tileAnalized = true;
    });


  }

  private PrepareTilesForAnalize() {

    this._field.forEach((row, i) => {
      row.forEach((tile, i) => {
        tile.tileAnalized = false;
      });
    });
  }

  private moveTile(tile: TileController, position: Vec3) {
    tile.move(tile.node.position, position);
  }

  public getStartTile(roteId: number): TileController {
    const startModel = this.fieldModel.getTileModel('start');
    return this.getTile(roteId, startModel);
  }

  public getEndTile(roteId: number): TileController {
    const startModel = this.fieldModel.getTileModel('end');
    return this.getTile(roteId, startModel);
  }

  public getTile(roteId: number, tileType: TileModel): TileController {

    let res = null;

    this._field.forEach((row, i) => {
      if (row[roteId].tileTypeId == tileType.Id) {
        res = row[roteId];
        return;
      }
    });

    return res;
  }

  update(deltaTime: number) {

  }
}