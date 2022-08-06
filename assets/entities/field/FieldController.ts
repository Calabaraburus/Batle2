import {
  _decorator,
  Component,
  Node,
  UITransform,
  Vec3,
  randomRangeInt,
  EventTarget
} from 'cc';
import { TileController } from '../tiles/TileController';
import { TileModel } from '../../models/TileModel';
import { StdTileController } from '../tiles/UsualTile/StdTileController';
import { FieldModel } from '../../models/FieldModel';
import { TileCreator } from './TileCreator';
import { CreateTileArgs } from './CreateTileArgs';
import { FieldAnalizer } from './FieldAnalizer';
import { AnalizedData } from './AnalizedData';
const { ccclass, property } = _decorator;

@ccclass('FieldController')
export class FieldController extends Component {

  /**
  * Logic field (e.g. tiles matrix)
  */
  private _field: TileController[][];
  private _timeToexecute = 0;
  private _canexecute = false;
  private _fieldAnalizer: FieldAnalizer;

  private readonly tileClickedEvent: EventTarget = new EventTarget();
  public readonly turnMadeEvent: EventTarget = new EventTarget();

  /** Field model */
  @property({ type: [FieldModel], visible: true, tooltip: 'Field model' })
  fieldModel: FieldModel;

  @property(UITransform)
  tilesArea: UITransform;

  @property(TileCreator)
  tileCreator: TileCreator;
  _analizedData: AnalizedData;

  get fieldAnalizer(): FieldAnalizer {
    return this._fieldAnalizer;
  }

  get logicField(): TileController[][] {
    return this._field;
  }

  start() {
    this.tileCreator.setModel(this.fieldModel);

    this._fieldAnalizer = new FieldAnalizer(this);

    this.generateTiles();
    this.EndTurn();
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
        let tile = this.createTile({ row: yIndex, col: xIndex, tileModel, putOnField: true });
      }
    }
  }

  /**
   * Creates tile instance
   * @param row row position on logic field                   
   * @param col col position on logic field                            
   * @param tileModel tile model                                        
   * @param position real position on scene                             
   * @param putOnField determines the need of putting tile on logic field
   * (game puts tile only to the scene)                  
   * @returns 
   */
  public createTile({ row,
    col,
    tileModel,
    position = null,
    putOnField = false }: CreateTileArgs): TileController {

    const tile = this.tileCreator.create(tileModel.tileName);

    const tileController = tile.getComponent(TileController);
    tileController.justCreated = true;
    tileController.setModel(tileModel);

    tileController.row = row;
    tileController.col = col;

    tileController.clickedEvent.on('TileController', this.tileClicked, this)

    var tPos = this.calculateTilePosition(row, col);

    tile.position = position == null ? tPos : position;
    tile.parent = this.tilesArea.node;

    const size = this.calculateTileSize(tile);

    tile.scale = size;

    if (putOnField) {
      this._field[row][col] = tileController;
    }

    return tileController;
  }

  private calculateTilePosition(row: number, col: number): Vec3 {
    const border = this.fieldModel.border / 2;
    let tW = this.tilesArea.width / this.fieldModel.cols;
    return new Vec3(col * tW + border, row * tW + border);
  }

  private calculateTileSize(tile: Node): Vec3 {
    let tileTransform = tile.getComponent(UITransform);
    let tW = this.tilesArea.width / this.fieldModel.cols;
    let coef = tW / (tileTransform.width + this.fieldModel.border);

    return new Vec3(coef, coef, tile.scale.z);
  }

  private _firstTileActivated = false;

  /**
   * Method invokes when one of tiles is clicked
   * @param tile tile controller of clicked tile
   */
  private tileClicked(tile: TileController): void {
    if (this._timeToexecute > 0) return;
    console.log("[tile] clicked. Name: " + tile.tileModel.tileName)

    this.tileClickedEvent.emit('FieldController', this, tile);

    if (!this._firstTileActivated) {
      this._firstTileActivated = true;
      this._timeToexecute = .2;
      this._canexecute = true;
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
            row[roteId].tileTypeId != emptyModel.tileId)) {
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
      var tile = this.createTile({
        row: tileRowId,
        col: roteId,
        tileModel: stdTileModels[randomRangeInt(0, stdTileModels.length)],
        position: this.calculateTilePosition(yPosIndex, startTile.col)
      });

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

  private OnBeforeTilesActivation() {

  }

  private OnAfterTilesActivation() {

  }

  private setTilesSpeciality() {
    this._analizedData.connectedTiles.forEach(tk => {
      tk.connectedTiles.forEach(tile => {

        if (tile instanceof StdTileController) {

          const stdTile = tile as StdTileController;

          if (tk.connectedTiles.size >= this.fieldModel.quantityToStar) {
            stdTile.setStar();
          } else if (tk.connectedTiles.size >= this.fieldModel.quantityToBomb) {
            stdTile.setBomb();
          } else if (tk.connectedTiles.size >= this.fieldModel.quantityToRocket) {
            stdTile.setRocket();
          } else {
            stdTile.resetSpecialSprite();
          }
        }
      });
    });
  }

  /** Apply just created to false for all new tiles */
  private fixTiles() {
    this._analizedData.justCreatedTiles.forEach(tile => {
      tile.justCreated = false;
    });
  }

  private onTurnMade() {
    this.turnMadeEvent.emit('FieldController', this);
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
      if (row[roteId].tileTypeId == tileType.tileId) {
        res = row[roteId];
        return;
      }
    });

    return res;
  }

  private moveTiles() {
    for (let index = 0; index < this.fieldModel.cols; index++) {
      this.moveAllTilesOnARote(index);
    }
  }

  /**
   * Destroy tiles
   * All tiles must be destroied by this method.
   * @param tile Tile
   */
  //public destroyTile(tile: TileController): void {

  //}

  update(deltaTime: number) {
    if (this._timeToexecute < 0 && this._canexecute) {

      this.EndTurn()

      this._canexecute = false;
      this._firstTileActivated = false;
    }
    this._timeToexecute -= deltaTime;
  }

  private EndTurn() {
    this._analizedData = this._fieldAnalizer.analize();
    this.moveTiles();
    this.setTilesSpeciality();
    this.fixTiles();
  }
}


