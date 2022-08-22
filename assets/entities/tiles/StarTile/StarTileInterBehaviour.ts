//  StarTileInterBehaviour.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { _decorator } from "cc";
import { FieldController } from "../../field/FieldController";
import { TileController } from "../TileController";
import { TileInterBehaviour } from "../TileInterBehaviour";
import { StarTileController } from "./StarTileController";
const { ccclass } = _decorator;

/**
 * Implements behaviour for bomb tiles
 */
@ccclass("StarTileInterBehaviour")
export class StarTileInterBehaviour extends TileInterBehaviour {
  tileClicked(field: FieldController, tile: TileController) {
    if (field.bonus != null) {
      return;
    }

    if (!(tile instanceof StarTileController)) {
      return;
    }

    const starTile = tile as StarTileController;

    field.logicField.forEach((r) => {
      r.forEach((tile) => {
        if (tile.tileModel.tileId == starTile.modelCreatedFrom.tileId) {
          tile.destroyTile();
        }
      });
    });

    starTile.destroyTile();
  }
}
