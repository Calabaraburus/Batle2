import { CCString, _decorator, SpriteFrame, Component, Button } from 'cc';
import { FieldController } from '../../field/FieldController';
import { TileController } from '../TileController';
import { TileInterBehaviour } from '../TileInterBehaviour';
import { TileState } from '../TileState';
import { StarTileController } from './StarTileController';
const { ccclass, property } = _decorator;

/**
 * Implements behaviour for bomb tiles
 */
@ccclass('StarTileInterBehaviour')
export class StarTileInterBehaviour extends TileInterBehaviour {
    tileClicked(field: FieldController, tile: TileController) {

        if (!(tile instanceof StarTileController)) {
            return;
        }

        const starTile = tile as StarTileController;

        field.logicField.forEach(r => {
            r.forEach(tile => {
                if (tile.tileModel.Id == starTile.modelCreatedFrom.Id) {
                    tile.destroyTile();
                }
            });
        });

        starTile.destroyTile();
    }
}