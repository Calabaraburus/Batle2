import { CCString, _decorator, SpriteFrame, Component, Button } from 'cc';
import { FieldController } from '../../field/FieldController';
import { TileController } from '../TileController';
import { TileInterBehaviour } from '../TileInterBehaviour';
import { TileState } from '../TileState';
import { RocketTileController } from './RocketTileController';
const { ccclass, property } = _decorator;

/**
 * Implements behaviour for rocket tiles
 */
@ccclass('RocketTileInterBehaviour')
export class RocketTileInterBehaviour extends TileInterBehaviour {
    tileClicked(field: FieldController, tile: TileController) {

        if (tile instanceof RocketTileController) {

            const rocketTile = tile as RocketTileController;

            if (!rocketTile.isVertical) {
                field.logicField[rocketTile.row].forEach((t) => {
                    if (!t.isDestroied && (t.tileModel.Name == "rocket" ||
                        t.tileModel.Name == "bomb")) {
                        t.activate();
                    }
                });
                field.logicField[rocketTile.row].forEach((t) => {
                    if (!t.isDestroied) {
                        t.destroyTile();
                    }
                });
            } else {
                field.logicField.forEach((row) => {
                    const t = row[tile.col];
                    if (!t.isDestroied && (t.tileModel.Name == "rocket" ||
                        t.tileModel.Name == "bomb")) {
                        t.activate();
                    }
                });
                field.logicField.forEach((row) => {
                    const t = row[tile.col];
                    if (!t.isDestroied) {
                        t.destroyTile()
                    }
                });
            }

            rocketTile.destroyTile();

        }
    }
}
