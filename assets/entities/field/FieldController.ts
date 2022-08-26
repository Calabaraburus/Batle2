//  FieldController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  _decorator,
  Component,
  Node,
  UITransform,
  Vec3,
  randomRangeInt,
  EventTarget,
} from "cc";
import { TileController } from "../tiles/TileController";
import { TileModel } from "../../models/TileModel";
import { StdTileController } from "../tiles/UsualTile/StdTileController";
import { FieldModel } from "../../models/FieldModel";
import { TileCreator } from "./TileCreator";
import { CreateTileArgs } from "./CreateTileArgs";
import { FieldAnalizer } from "./FieldAnalizer";
import { AnalizedData } from "./AnalizedData";
import { BonusModel } from "../../models/BonusModel";
import { Matrix2D } from "./Matrix2D";
import { ITileField } from "./ITileField";
import { ReadonlyMatrix2D } from "./ReadonlyMatrix2D";
const { ccclass, property } = _decorator;

@ccclass("FieldController")
export class FieldController extends Component implements ITileField {
  /**
   * Logic field (e.g. tiles matrix)
   */
  private _field: Matrix2D<TileController>; // TileController[][];
  private _timeToexecute = 0;
  private _canexecute = false;
  private _fieldAnalizer: FieldAnalizer;
  private _tilesToDestroy: TileController[] = [];
  private _bonus: BonusModel;

  public readonly tileClickedEvent: EventTarget = new EventTarget();
  public readonly endTurnEvent: EventTarget = new EventTarget();

  /** Field model */
  @property({ type: [FieldModel], visible: true, tooltip: "Field model" })
  fieldModel: FieldModel;

  @property(UITransform)
  tilesArea: UITransform;

  @property(TileCreator)
  tileCreator: TileCreator;
  _analizedData: AnalizedData;

  get fieldAnalizer(): FieldAnalizer {
    return this._fieldAnalizer;
  }

  get fieldMatrix(): ReadonlyMatrix2D<TileController> {
    return this._field.toReadonly();
  }

  get bonus(): BonusModel {
    return this._bonus;
  }

  start() {
    this.tileCreator.setModel(this.fieldModel);
    this._field = new Matrix2D(this.fieldModel.rows, this.fieldModel.cols);
    this._fieldAnalizer = new FieldAnalizer(this);

    this.generateTiles();
    this.EndTurn(true);
  }

  /**
   * Generate tile field
   */
  private generateTiles() {
    console.log(
      "[field] Rows: " + this.fieldModel.rows + " Cols: " + this.fieldModel.cols
    );

    const map = this.fieldModel.getFieldMap();

    for (let yIndex = 0; yIndex < this.fieldModel.rows; yIndex++) {
      for (let xIndex = 0; xIndex < this.fieldModel.rows; xIndex++) {
        const tileModel = this.fieldModel.getTileModelByMapMnemonic(
          map[yIndex][xIndex]
        );
        this.createTile({
          row: yIndex,
          col: xIndex,
          tileModel,
          putOnField: true,
        });
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
  public createTile({
    row,
    col,
    tileModel,
    position = null,
    putOnField = false,
  }: CreateTileArgs): TileController {
    const tile = this.tileCreator.create(tileModel.tileName);

    const tileController = tile.getComponent(TileController);
    tileController.justCreated = true;
    tileController.setModel(tileModel);

    tileController.row = row;
    tileController.col = col;

    tileController.clickedEvent.on("TileController", this.tileClicked, this);

    const tPos = this.calculateTilePosition(row, col);

    tile.position = position == null ? tPos : position;
    tile.parent = this.tilesArea.node;

    const size = this.calculateTileSize(tile);

    tile.scale = size;

    if (putOnField) {
      this.destroyOldTileAndPutNew(tileController, row, col);
    }

    return tileController;
  }

  private calculateTilePosition(row: number, col: number): Vec3 {
    const border = this.fieldModel.border / 2;
    const tW = this.tilesArea.width / this.fieldModel.cols;
    return new Vec3(col * tW + border, row * tW + border);
  }

  private calculateTileSize(tile: Node): Vec3 {
    const tileTransform = tile.getComponent(UITransform);
    const tW = this.tilesArea.width / this.fieldModel.cols;
    const coef = tW / (tileTransform.width + this.fieldModel.border);

    return new Vec3(coef, coef, tile.scale.z);
  }

  private _firstTileActivated = false;

  /**
   * Method invokes when one of tiles is clicked
   * @param tile tile controller of clicked tile
   */
  private tileClicked(tile: TileController): void {
    if (this._timeToexecute > 0) return;
    console.log("[tile] clicked. Name: " + tile.tileModel.tileName);

    this.tileClickedEvent.emit("FieldController", this, tile);

    if (!this._firstTileActivated) {
      if (this.bonus != null) {
        this.setBonus(null);
      } else {
        this._firstTileActivated = true;
        this._timeToexecute = 0.2;
        this._canexecute = true;
      }
    }
  }

  private moveAllTilesOnARote(roteId: number) {
    const startTile = this.getStartTile(roteId);
    const endTile = this.getEndTile(roteId);
    const emptyModel = this.fieldModel.getTileModel("empty");

    if (startTile == null || endTile == null) {
      return;
    }

    const findTiles = (destroied: boolean): TileController[] => {
      const res: TileController[] = [];

      this._field.forEach((tile, rowId, colId) => {
        if (roteId == colId) {
          if (
            tile.isDestroied == destroied &&
            tile != startTile &&
            tile != endTile &&
            tile.tileTypeId != emptyModel.tileId
          ) {
            res.push(tile);
          }
        }
      });

      return res;
    };

    const fwd = endTile.row > startTile.row;
    const destroiedTiles = findTiles(true);

    if (destroiedTiles.length == 0) {
      return;
    }

    const stdTileModels = this.fieldModel.getStandartTiles();

    const pathTiles = [];

    // add new tiles
    for (let index = 0; index < destroiedTiles.length; index++) {
      const tileRowId = fwd
        ? startTile.row + 1 + index
        : startTile.row - 1 - index;
      const yPosIndex = fwd
        ? startTile.row - 1 - index
        : startTile.row + 1 + index;

      const tile = this.createTile({
        row: tileRowId,
        col: roteId,
        tileModel: stdTileModels[randomRangeInt(0, stdTileModels.length)],
        position: this.calculateTilePosition(yPosIndex, startTile.col),
      });

      pathTiles[fwd ? index : destroiedTiles.length - index - 1] = tile;
    }

    const liveTiles = findTiles(false);
    liveTiles.forEach((t, i) => {
      pathTiles[destroiedTiles.length + (fwd ? i : liveTiles.length - i - 1)] =
        t;
    });

    pathTiles.forEach((t: TileController, i) => {
      const tileRowId = fwd ? startTile.row + 1 + i : startTile.row - 1 - i;
      t.row = tileRowId;

      this.destroyOldTileAndPutNew(t, t.row, t.col);

      this.moveTile(t, this.calculateTilePosition(t.row, t.col));
    });
  }

  private destroyOldTileAndPutNew(
    tile: TileController,
    row: number,
    col: number
  ) {
    const oldTile = this._field.get(row, col);
    if (oldTile != null) {
      //  this._tilesToDestroy.push(oldTile);
    }

    this._field.set(row, col, tile);
  }

  private setTilesSpeciality() {
    // Speciality for connected std tiles
    this._analizedData.connectedTiles.forEach((tk) => {
      tk.connectedTiles.forEach((tile) => {
        if (tile instanceof StdTileController) {
          if (tk.connectedTiles.size >= this.fieldModel.quantityToStar) {
            tile.setStar();
          } else if (tk.connectedTiles.size >= this.fieldModel.quantityToBomb) {
            tile.setBomb();
          } else if (
            tk.connectedTiles.size >= this.fieldModel.quantityToRocket
          ) {
            tile.setRocket();
          } else {
            tile.resetSpecialSprite();
          }
        }
      });
    });

    // All other tiles have no speciality
    this._analizedData.individualTiles.forEach((tile) => {
      if (tile instanceof StdTileController) {
        tile.resetSpecialSprite();
      }
    });
  }

  /** Apply just created to false for all new tiles */
  private fixTiles() {
    this._analizedData.justCreatedTiles.forEach((tile) => {
      tile.justCreated = false;
    });
  }

  private finalyDestroyTiles() {
    this._tilesToDestroy.forEach((tile) => tile.destroy());
    this._tilesToDestroy.length = 0;
  }

  private onEndTurn() {
    this.endTurnEvent.emit("FieldController", this, this._analizedData);
  }

  private moveTile(tile: TileController, position: Vec3) {
    tile.move(tile.node.position, position);
  }

  public getStartTile(roteId: number): TileController {
    const startModel = this.fieldModel.getTileModel("start");
    return this.getTile(roteId, startModel);
  }

  public getEndTile(roteId: number): TileController {
    const startModel = this.fieldModel.getTileModel("end");
    return this.getTile(roteId, startModel);
  }

  public getTile(roteId: number, tileType: TileModel): TileController {
    let res = null;

    this._field.forEach((tile, i, j) => {
      if (j == roteId) {
        if (tile.tileTypeId == tileType.tileId) {
          res = tile;
          return;
        }
      }
    });

    return res;
  }

  public mixTiles(): void {
    const rndTiles: TileController[] = [];

    this._field.forEach((tile) => {
      if (
        !(
          tile.tileModel.tileName == "start" ||
          tile.tileModel.tileName == "empty" ||
          tile.tileModel.tileName == "end"
        )
      ) {
        rndTiles.push(tile);
      }
    });

    const tindxs = Array.from(Array<number>(rndTiles.length).keys());

    while (tindxs.length > 0) {
      const id: number = randomRangeInt(0, tindxs.length);
      const tndid = tindxs[id];
      tindxs.splice(id, 1);
      const id2: number = randomRangeInt(0, tindxs.length);
      const tndid2 = tindxs[id2];
      tindxs.splice(id2, 1);
      this.exchangeTiles(rndTiles[tndid], rndTiles[tndid2]);
    }

    this._field.forEach((tile) => {
      tile.node.parent = null;
      tile.node.parent = this.tilesArea.node;

      this.moveTile(tile, this.calculateTilePosition(tile.row, tile.col));
    });

    this._timeToexecute = 0;
    this._canexecute = true;
  }

  private exchangeTiles(t1: TileController, t2: TileController) {
    this._field.set(t1.row, t1.col, t2);
    this._field.set(t2.row, t2.col, t1);

    let tval = t1.row;
    t1.row = t2.row;
    t2.row = tval;

    tval = t1.col;
    t1.col = t2.col;
    t2.col = tval;
  }

  public Reset() {
    this._field.forEach((tile) => {
      tile.destroyTile();
      // this._tilesToDestroy.push(tile);
    });

    this.generateTiles();
    this.EndTurn(true);
  }

  private moveTiles() {
    for (let index = 0; index < this.fieldModel.cols; index++) {
      this.moveAllTilesOnARote(index);
    }
  }

  public setBonus(bonus: BonusModel) {
    this._bonus = bonus;
  }

  update(deltaTime: number) {
    if (this._timeToexecute < 0 && this._canexecute) {
      this.EndTurn();

      this._canexecute = false;
      this._firstTileActivated = false;
    }
    this._timeToexecute -= deltaTime;
  }

  private EndTurn(initial = false) {
    this.finalyDestroyTiles();
    this.moveTiles();
    this._analizedData = this._fieldAnalizer.analize();

    this.setTilesSpeciality();
    this.fixTiles();

    if (this._analizedData.connectedTiles.length <= 0) {
      this.mixTiles();
    }

    if (!initial) {
      if (this._analizedData.justCreatedTiles.length > 0) {
        this.onEndTurn();
      }
    }
  }
}
