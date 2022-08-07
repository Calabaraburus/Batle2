import { CCString, _decorator, SpriteFrame, Component, Button } from 'cc';
import { FieldController } from '../../field/FieldController';
import { TileController } from '../../tiles/TileController';
import { TileInterBehaviour } from '../../tiles/TileInterBehaviour';
const { ccclass, property } = _decorator;

/**
 * Implements behaviour for bomb tiles
 */
@ccclass('BombPutInterBehaviour')
export class BombPutInterBehaviour extends TileInterBehaviour {
    tileClicked(field: FieldController, tile: TileController) {
        if (field.bonus == null) {
            return;
        }
        if (field.bonus.type.tileName != "bomb") {
            return;
        }
        if (tile.tileModel.specialTile) {
            field.setBonus(null);
            return;
        }

        var bombModel = this.field.fieldModel.getTileModel('bomb');
        var emptyModel = this.field.fieldModel.getTileModel('empty');

        const resTile = field.createTile({
            row: tile.row,
            col: tile.col,
            tileModel: bombModel,
            putOnField: true
        });

        resTile.justCreated = false;
        tile.destroyTile();
    }
}
