import { CCString, _decorator, SpriteFrame, Component, Button } from 'cc';
import { FieldController } from '../../field/FieldController';
import { TileController } from '../TileController';
import { TileInterBehaviour } from '../TileInterBehaviour';
import { TileState } from '../TileState';
import { StdTileController } from './StdTileController';
const { ccclass, property } = _decorator;

/**
 * Implements behaviour for simple tiles
 */
@ccclass('StdTileInterBehaviour')
export class StdTileInterBehaviour extends TileInterBehaviour {
    tileClicked(field: FieldController, tile: TileController) {

        let connectedTiles = field.getConnectedTiles(tile);

        if (tile instanceof StdTileController) {

            const stdTile = tile as StdTileController;
            if (stdTile.state == TileState.rocket) {
                var rocketModel = this.field.fieldModel.getTileModel('rocket');
                const rocketTile = field.createTile({
                    row: tile.row,
                    col: tile.col,
                    tileModel: rocketModel,
                    putOnField: true
                });
            }
        }

        connectedTiles.forEach(item => item.destroyTile());
    }
}


