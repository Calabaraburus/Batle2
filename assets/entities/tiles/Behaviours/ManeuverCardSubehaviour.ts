import { ObjectsCache } from "../../../ObjectsCache/ObjectsCache";
import { TileModel } from "../../../models/TileModel";
import { AudioManager } from "../../../soundsPlayer/AudioManager";
import { TileController } from "../TileController";
import { StdTileController } from "../UsualTile/StdTileController";
import { CardsSubBehaviour } from "./SubBehaviour";

export class ManeuverCardSubehaviour extends CardsSubBehaviour {
  private _tilesToManeuv: TileController[] = [];
  private _cache: ObjectsCache | null;
  protected powerCard = 1;
  private _targetTile: StdTileController;
  private _soundEffect: AudioManager | null;

  prepare(): boolean {
    const maxCountForEachSide = this.powerCard;
    this._targetTile = this.parent.target as StdTileController;

    if (this._targetTile instanceof StdTileController) {
      if (
        this._targetTile.playerModel ==
        this.parent.cardService.getOponentModel()
      ) {
        return false;
      }
    } else {
      return false;
    }

    this._cache = ObjectsCache.instance;
    this._tilesToManeuv = [];
    const tilesInRow:TileController[] = [];
    // tilesInRow.push(this._targetTile);

    this.parent.field?.fieldMatrix.forEachCol(
      this._targetTile.col,
      (tile, rowId) => {
        if (tile.playerModel == this.parent.currentPlayerModel) {
          if (
            this._targetTile.row + maxCountForEachSide >= rowId &&
            this._targetTile.row - maxCountForEachSide <= rowId
          ) {
            tilesInRow.push(tile);
            // if(tile!=this._targetTile) {
            //   this._tilesToManeuv.push(tile)
            // }
          }
        }
      }
    );

    tilesInRow.forEach((t) =>
      this.parent.field?.fieldMatrix.forEachInRow(t.row, (tile, colId) => {
        if (tile.playerModel == this.parent.currentPlayerModel) {
          if (
            t.col + maxCountForEachSide >= colId &&
            t.col - maxCountForEachSide <= colId
          ) {
            this._tilesToManeuv.push(tile);
          }
        }
      })
    );
    this._tilesToManeuv.forEach((t)=>{console.log(t.col)
      console.log(t.row)}
    )
    
    return true;
  }

  run(): boolean {
    this.parent.debug?.log("[maneuver_card_sub] Starting run.");

    const tModel = this._targetTile.tileModel;

    const tileList: TileModel[] = [];

    if (tModel == undefined) {
      this.parent.debug?.log(
        "[maneuver_card_sub][error] maneuver model is null. return false."
      );
      return false;
    }

    const pModel = this.parent.cardService.getCurrentPlayerModel();

    if (pModel == undefined || pModel == null) {
      this.parent.debug?.log(
        "[maneuver_card_sub][error] CurrentPlayerModel is null or undefined." +
          " return false."
      );
      return false;
    }
    if(["r","y","p"].includes(tModel.tileName)){
      const swordTile = this.parent.field?.fieldModel.getTileModel("r");
      if (tModel != swordTile) tileList.push(swordTile);
      const shieldTile = this.parent.field?.fieldModel.getTileModel("y");
      if (tModel != shieldTile) tileList.push(shieldTile);
      const bowTile = this.parent.field?.fieldModel.getTileModel("p");
      if (tModel != bowTile) tileList.push(bowTile);}
     
    if (["b","g","k"].includes(tModel.tileName)) {
      const swordBTile = this.parent.field?.fieldModel.getTileModel("b");
      if (tModel != swordBTile) tileList.push(swordBTile);
      const shielBdTile = this.parent.field?.fieldModel.getTileModel("g");
      if (tModel != shielBdTile) tileList.push(shielBdTile);
      const bowBTile = this.parent.field?.fieldModel.getTileModel("k");
      if (tModel != bowBTile) tileList.push(bowBTile);
    }

    // if (tileList.length != 2) return false;

    const coordFirst = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];
    const coordSecond = [
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];

    this._tilesToManeuv.forEach((t) => {
      coordFirst.forEach((c) => {

        if (t.row == this._targetTile.row + c[0] && t.col == this._targetTile.col + c[1]) {
          t.cacheDestroy();

          this.parent.field?.createTile({
            row: t.row,
            col: t.col,
            tileModel: tileList[0],
            playerModel: pModel,
            position: t.node.position,
            putOnField: true,
          });
        }
      });
      coordSecond.forEach((c) => {
        if (t.row == this._targetTile.row + c[0] && t.col == this._targetTile.col + c[1]) {
          t.cacheDestroy();

          this.parent.field?.createTile({
            row: t.row,
            col: t.col,
            tileModel: tileList[1],
            playerModel: pModel,
            position: t.node.position,
            putOnField: true,
          });
        }
      });
    });

    this.parent.debug?.log("[maneuver_card_sub] End run with true.");
    return true;
  }

  effect(): boolean {
    this.parent.fieldViewController.moveTilesAnimate();
    this.parent.audioManager.playSoundEffect("maneuver");

    return true;
  }
}
