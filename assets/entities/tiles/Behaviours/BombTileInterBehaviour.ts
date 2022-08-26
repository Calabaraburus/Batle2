//  BombTileInterBehaviour.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { _decorator } from "cc";
import { FieldController } from "../../field/FieldController";
import { TileController } from "../TileController";
import { TileInterBehaviour } from "../TileInterBehaviour";
import { BombTileController } from "../BombTile/BombTileController";
const { ccclass } = _decorator;

/**
 * Implements behaviour for bomb tiles
 */
@ccclass("BombTileInterBehaviour")
export class BombTileInterBehaviour extends TileInterBehaviour {
  tileClicked(field: FieldController, tile: TileController) {
    if (field.bonus != null) {
      return;
    }

    if (!(tile instanceof BombTileController)) {
      return;
    }

    const bombTile = tile as BombTileController;

    let startRow = tile.row - bombTile.fireDistance;
    startRow = startRow < 0 ? 0 : startRow;

    let endRow = tile.row + bombTile.fireDistance;
    endRow =
      endRow >= field.fieldModel.rows ? field.fieldModel.rows - 1 : endRow;

    let startCol = tile.col - bombTile.fireDistance;
    startCol = startCol < 0 ? 0 : startCol;

    let endCol = tile.col + bombTile.fireDistance;
    endCol =
      endCol >= field.fieldModel.cols ? field.fieldModel.cols - 1 : endCol;

    const iterateTiles = (callback: (t: TileController) => void) => {
      for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
          const t = field.fieldMatrix.get(i, j);
          callback(t);
        }
      }
    };

    iterateTiles((t: TileController) => {
      if (
        !t.isDestroied &&
        t.tileModel.tileName != "star" &&
        (t.tileModel.tileName == "rocket" || t.tileModel.tileName == "bomb")
      ) {
        t.activate();
      }
    });

    iterateTiles((t: TileController) => {
      if (!t.isDestroied && t.tileModel.tileName != "star") {
        t.destroyTile();
      }
    });

    bombTile.destroyTile();
  }
}
