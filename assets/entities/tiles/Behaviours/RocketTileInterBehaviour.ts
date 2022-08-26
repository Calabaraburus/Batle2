//  RocketTileInterBehaviour.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { _decorator } from "cc";
import { FieldController } from "../../field/FieldController";
import { TileController } from "../TileController";
import { TileInterBehaviour } from "../TileInterBehaviour";
import { RocketTileController } from "../RocketTile/RocketTileController";
const { ccclass } = _decorator;

/**
 * Implements behaviour for rocket tiles
 */
@ccclass("RocketTileInterBehaviour")
export class RocketTileInterBehaviour extends TileInterBehaviour {
  tileClicked(field: FieldController, tile: TileController) {
    if (field.bonus != null) {
      return;
    }

    if (!(tile instanceof RocketTileController)) {
      return;
    }

    const rocketTile = tile as RocketTileController;

    if (!rocketTile.isVertical) {
      field.fieldMatrix.forEachInRow(rocketTile.row, (t) => {
        if (
          !t.isDestroied &&
          (t.tileModel.tileName == "rocket" || t.tileModel.tileName == "bomb")
        ) {
          t.activate();
        }
      });
      field.fieldMatrix.forEachInRow(rocketTile.row, (t) => {
        if (!t.isDestroied) {
          t.destroyTile();
        }
      });
    } else {
      field.fieldMatrix.forEachCol(tile.col, (t) => {
        if (
          !t.isDestroied &&
          t.tileModel.tileName != "star" &&
          (t.tileModel.tileName == "rocket" || t.tileModel.tileName == "bomb")
        ) {
          t.activate();
        }
      });
      field.fieldMatrix.forEachCol(tile.col, (t) => {
        if (!t.isDestroied && t.tileModel.tileName != "star") {
          t.destroyTile();
        }
      });
    }

    rocketTile.destroyTile();
  }
}
