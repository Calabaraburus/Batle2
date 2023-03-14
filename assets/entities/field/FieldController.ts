//  FieldController.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import {
  _decorator,
  Component,
  UITransform,
  Vec3,
  randomRangeInt,
  EventTarget,
  Vec2,
  CCString,
  CCBoolean,
} from "cc";
import { TileController } from "../tiles/TileController";
import { TileModel } from "../../models/TileModel";
import { FieldModel } from "../../models/FieldModel";
import { TileCreator } from "./TileCreator";
import { CreateTileArgs } from "./CreateTileArgs";
import { FieldAnalizer } from "./FieldAnalizer";
import { AnalizedData } from "./AnalizedData";
import { BonusModel } from "../../models/BonusModel";
import { Matrix2D } from "./Matrix2D";
import { ITileField } from "./ITileField";
import { ReadonlyMatrix2D } from "./ReadonlyMatrix2D";
import { BackgroundTileController } from "../tiles/BackgroundTile/BackgroundTileController";
import { Service } from "../services/Service";
import { DataService } from "../services/DataService";
const { ccclass, property } = _decorator;

@ccclass("FieldController")
export class FieldController extends Service implements ITileField {
  /**
   * Logic field (e.g. tiles matrix)
   */
  private _field: Matrix2D<TileController>;
  private _bckgField: BackgroundTileController[][] = [];
  private _timeToexecute = 0;
  private _canexecute = false;
  private _fieldAnalizer: FieldAnalizer;
  private _tilesToDestroy: TileController[] = [];
  private _bonus: BonusModel;
  private _tileCreator: TileCreator | null;
  private _dataService: DataService | null;

  public get dataService(): DataService | null {
    return this._dataService;
  }

  public readonly tileClickedEvent: EventTarget = new EventTarget();
  public readonly tileActivatedEvent: EventTarget = new EventTarget();

  /** Field model */
  @property({ type: [FieldModel], visible: true, tooltip: "Field model" })
  fieldModel: FieldModel;

  @property(UITransform)
  tilesArea: UITransform;

  @property(UITransform)
  tilesBckgArea: UITransform;

  @property(CCString)
  backgroundTileName = "background";

  @property(CCBoolean)
  drawBackground = false;

  public get tileCreator(): TileCreator | null {
    return this._tileCreator;
  }
  public set tileCreator(value: TileCreator | null) {
    this._tileCreator = value;
  }

  get fieldMatrix(): ReadonlyMatrix2D<TileController> {
    return this._field.toReadonly();
  }

  get bonus(): BonusModel {
    return this._bonus;
  }

  get tiles(): Array<TileController> {
    return [];
  }

  public setDataService(service: DataService | null) {
    this._dataService = service;
  }

  start() {
    this._field = new Matrix2D(this.fieldModel.rows, this.fieldModel.cols);
    this._fieldAnalizer = new FieldAnalizer(this);
    // this._dataService = this.getService(DataService);
  }

  /**
   * Generate tile field
   */
  public generateTiles() {
    console.log(
      "[field] Rows: " + this.fieldModel.rows + " Cols: " + this.fieldModel.cols
    );

    if (this._tileCreator == null) {
      throw Error("Tile creator is null.");
    }

    const map = this.fieldModel.getFieldMap();
    const bkgTileModel = this.fieldModel.getTileModel(this.backgroundTileName);

    for (let yIndex = 0; yIndex < this.fieldModel.rows; yIndex++) {
      this._bckgField[yIndex] = [];

      for (let xIndex = 0; xIndex < this.fieldModel.cols; xIndex++) {
        if (this.drawBackground) {
          const bkgTile = this.createBckgTile(yIndex, xIndex, bkgTileModel);

          if (bkgTile != null) {
            this._bckgField[yIndex][xIndex] = bkgTile;
          }
        }

        const mapMnem = map[yIndex][xIndex];

        const tileModel = this.fieldModel.getTileModelByMapMnemonic(mapMnem);

        if (tileModel != null) {
          this.createTile({
            row: yIndex,
            col: xIndex,
            tileModel,
            playerModel:
              mapMnem == "?"
                ? this._dataService!.playerModel
                : mapMnem == "^"
                ? this._dataService!.botModel
                : null,
            putOnField: true,
          });
        }
      }
    }
  }

  private createBckgTile(
    row: number,
    col: number,
    tileModel: TileModel | null
  ): BackgroundTileController | null {
    if (this._tileCreator == null) {
      throw Error("Tile creator is null.");
    }

    if (tileModel == null) {
      throw Error("Tile model argument is null");
    }
    if (tileModel == null) return null;

    const tile = this._tileCreator.create(tileModel.tileName);

    if (tile == null) return null;

    const tileController = tile.getComponent(BackgroundTileController);
    const uiTransform = tileController?.getComponent(UITransform);

    if (tileController != null) {
      tileController.tileModel = tileModel;

      this._bckgField[row][col] = tileController;
    }

    tile.position = this.calculateTilePosition(row, col);
    tile.parent = this.tilesBckgArea.node;
    tile.scale = this.calculateTileSize(uiTransform);

    return tileController;
  }

  /**
   * Creates tile instance
   * @param row row position on logic field
   * @param col col position on logic field
   * @param tileModel tile model
   * @param playerModel player model
   * @param position real position on scene
   * @param putOnField determines the need of putting tile on logic field
   * (game puts tile only to the scene)
   * @returns returns tile controller
   */
  public createTile({
    row,
    col,
    tileModel,
    playerModel,
    position = null,
    putOnField = false,
  }: CreateTileArgs): TileController | null {
    if (this._tileCreator == null) {
      throw Error("Tile creator is null.");
    }

    if (tileModel == null) {
      throw Error("Tile model argument is null");
    }
    const tile = this._tileCreator.create(tileModel.tileName);

    if (tile == null) return null;

    const tileController = tile.getComponent(TileController);

    if (tileController != null) {
      tileController.justCreated = true;
      tileController.setModel(tileModel);
      tileController.setField(this);
      tileController.playerModel = playerModel;
      tileController.row = row;
      tileController.col = col;
      tileController.clickedEvent.off("TileController");
      tileController.tileActivateEvent.off("TileController");
      tileController.clickedEvent.on("TileController", this.tileClicked, this);
      tileController.tileActivateEvent.on(
        "TileController",
        this.tileActivated,
        this
      );

      if (putOnField) {
        this._field.set(row, col, tileController);
      }
    }

    const uiTransform = tileController?.getComponent(UITransform);

    const tPos = this.calculateTilePosition(row, col);

    tile.position = position == null ? tPos : position;
    tile.parent = this.tilesArea.node;

    const size = this.calculateTileSize(uiTransform);

    tile.scale = size;

    return tileController;
  }

  private calculateTilePosition(row: number, col: number): Vec3 {
    const border = this.fieldModel.border / 2;
    const tW = this.tilesArea.width / this.fieldModel.cols;
    const tilesHeight = tW * this.fieldModel.rows;
    return new Vec3(
      col * tW +
        border -
        this.tilesArea.anchorX * this.tilesArea.width +
        tW / 2,
      row * tW + border - this.tilesArea.anchorY * tilesHeight + tW / 2
    );
  }

  private calculateTileSize(
    tileTransform: UITransform | null | undefined
  ): Vec3 {
    const tW = this.tilesArea.width / this.fieldModel.cols;
    const tileTransformwidth = tileTransform != null ? tileTransform.width : 0;
    const coef = tW / (tileTransformwidth + this.fieldModel.border);

    return new Vec3(coef, coef, 1);
  }

  private _firstTileActivated = false;

  /**
   * Method invokes when one of tiles is clicked
   * @param tile tile controller of clicked tile
   */
  private tileClicked(tile: TileController): void {
    console.log("[tile] clicked. Name: " + tile.tileModel.tileName);
    this.tileClickedEvent.emit("FieldController", this, tile);
  }

  private tileActivated(tile: TileController): void {
    this.tileActivatedEvent.emit("FieldController", this, tile);
  }

  private moveAllTilesOnARote(roteId: number, backwards = false) {
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

    let fwd = endTile.row > startTile.row;
    fwd = backwards ? !fwd : fwd;

    const tStartTile = backwards ? endTile : startTile;

    const destroiedTiles = findTiles(true).map((t) => new Vec2(t.col, t.row));

    if (destroiedTiles.length == 0) {
      return;
    }

    const pathTiles: TileController[] | null[] = [];

    const tileMapSimbol = fwd ? "?" : "^";

    // fins all live tiles and put them to path
    const liveTiles = findTiles(false);
    liveTiles.forEach((t, i) => {
      pathTiles[destroiedTiles.length + (fwd ? i : liveTiles.length - i - 1)] =
        t;
    });

    // add new tiles
    for (let index = 0; index < destroiedTiles.length; index++) {
      const tileRowId = fwd
        ? tStartTile.row + 1 + index
        : tStartTile.row - 1 - index;
      const yPosIndex = fwd
        ? tStartTile.row - 1 - index
        : tStartTile.row + 1 + index;

      const tile = this.createTile({
        row: tileRowId,
        col: roteId,
        tileModel: this.fieldModel.getTileModelByMapMnemonic(tileMapSimbol),
        playerModel:
          tileMapSimbol == "?"
            ? this._dataService!.playerModel
            : tileMapSimbol == "^"
            ? this._dataService!.botModel
            : null,
      });

      if (tile != null) {
        tile.node.position = this.calculateTilePosition(
          yPosIndex,
          startTile.col
        );
      }

      pathTiles[fwd ? index : destroiedTiles.length - index - 1] = tile;
    }

    pathTiles.forEach((t: TileController | null, i) => {
      if (t == null) {
        throw Error("Tile in path is null. It can't be null");
      }

      const tileRowId = fwd ? tStartTile.row + 1 + i : tStartTile.row - 1 - i;
      t.row = tileRowId;

      this._field.set(t.row, t.col, t);
    });
  }

  public fakeDestroyTile(tile: TileController): void {
    tile.fakeDestroy();
    this._tilesToDestroy.push(tile);
  }

  /** Apply current state of field, destroies all fake destroied tiles. */
  public Flush() {
    this.finalyDestroyTiles();
  }

  /**
   * Update background tiles
   */
  public updateBackground() {
    if (!this.drawBackground) return;
    this._field.forEach((tile: TileController) => {
      this._bckgField[tile.row][tile.col].SetTypeBasedOnForegroundTile(tile);
    });
  }

  /** Apply just created to false for all new tiles */
  public fixTiles(analizedData: AnalizedData) {
    analizedData.justCreatedTiles.forEach((tile) => {
      tile.justCreated = false;
    });
  }

  private finalyDestroyTiles() {
    this._tilesToDestroy.forEach((tile) => tile.destroyTile());
    this._tilesToDestroy.length = 0;
  }

  private moveTile(tile: TileController, position: Vec3) {
    tile.move(tile.node.position, position);
  }

  public getStartTile(roteId: number): TileController | null {
    const startModel = this.fieldModel.getTileModel("start");
    return this.getTile(roteId, startModel);
  }

  public getEndTile(roteId: number): TileController | null {
    const startModel = this.fieldModel.getTileModel("end");
    return this.getTile(roteId, startModel);
  }

  public getTile(roteId: number, tileType: TileModel): TileController | null {
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

  public exchangeTiles(t1: TileController, t2: TileController) {
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

    // this.generateTiles();
    // this.EndTurn(true);
  }

  public moveTilesLogicaly(backwards = false) {
    for (let index = 0; index < this.fieldModel.cols; index++) {
      this.moveAllTilesOnARote(index, backwards);
    }
  }

  /** Animate tiles moving to real position */
  public moveTilesAnimate() {
    this._field.forEach((t) => {
      this.moveTile(t, this.calculateTilePosition(t.row, t.col));
    });
  }

  public moveTiles(backwards = false) {
    const analizedData = this._fieldAnalizer?.analize();

    if (analizedData != null) {
      this.moveTilesLogicaly(backwards);
      this.fixTiles(analizedData);
      this.updateBackground();
      this.Flush();
      this.moveTilesAnimate();
    }
  }

  public setBonus(bonus: BonusModel) {
    this._bonus = bonus;
  }
}
