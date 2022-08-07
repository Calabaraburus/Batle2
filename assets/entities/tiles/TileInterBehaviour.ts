import { CCString, _decorator, SpriteFrame, Component, Button, CCInteger } from 'cc';
import { FieldController } from '../field/FieldController';
import { TileController } from './TileController';

const { ccclass, property } = _decorator;

/**
 * Implements tile behaviour
 */
@ccclass('TileInterBehaviour')
export class TileInterBehaviour extends Component {
    private _field: FieldController;

    @property({ type: CCInteger })
    order: number = 0;

    get field(): FieldController {
        return this._field;
    }
    set field(value: FieldController) {
        this._field = value;
        this._field.tileClickedEvent.on('FieldController', this.tileClicked, this);
    }

    tileClicked(field: FieldController, tile: TileController) {
    }
}
