import { CCString, _decorator, SpriteFrame, Component, Button } from 'cc';
import { FieldController } from '../field/FieldController';
import { TileController } from './TileController';

const { ccclass, property } = _decorator;

/**
 * Implements tile behaviour
 */
@ccclass('TileInterBehaviour')
export class TileInterBehaviour extends Component {
    private _field: FieldController;

    get field(): FieldController {
        return this._field;
    }

    start() {
        this._field = this.getComponent(FieldController);
        this._field.tileClickedEvent.on('FieldController', this.tileClicked, this);
    }

    tileClicked(field: FieldController, tile: TileController) {
    }
}
