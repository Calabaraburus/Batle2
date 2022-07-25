import { _decorator, Component, Node, Sprite, SpriteFrame, random, randomRangeInt, logID, log, EventTarget, Color, Vec2, Button } from 'cc';
import { FieldController } from '../field/FieldController';
import { TileModel } from './TileModel';
const { ccclass, property } = _decorator;

@ccclass('TileController')
export class TileController extends Component {

    private _curSprite: Sprite;
    private _field: FieldController;
    private _button: Button;

    public clickedEvent: EventTarget = new EventTarget();

    /**Tile model */
    @property(TileModel)
    tileModel: TileModel;

    private _isDestroied = false;
    get isDestroied(): boolean {
        return this._isDestroied;
    }

    get tileTypeId(): number {
        return this.tileModel.Id;
    }

    private _col: number = 0;
    get col(): number {
        return this._col;
    }
    set col(value: number) {
        this._col = value;
    }

    private _row: number = 0;
    get row(): number {
        return this._row;
    }
    set row(value: number) {
        this._row = value;
    }

    start() {
        this._curSprite = this.getComponent(Sprite);
        this._button = this.getComponent(Button);
        this.updateSprite();
    }

    public setTile(tileModel: TileModel) {
        if (tileModel == null) {
            log("[tile] tile model can't be null");
            return;
        }

        this.tileModel = tileModel;

        if (tileModel.Name == "start" ||
            tileModel.Name == "end" ||
            tileModel.Name == "empty") {
            this._button = this.getComponent(Button);
            this._button.interactable = false;
        }
    }

    public setField(field: FieldController) {
        this._field = field;
    }

    updateSprite() {
        if (this._curSprite != null) {
            this._curSprite.spriteFrame = this.tileModel.Sprite;
        }
    }

    public clicked() {
        this.clickedEvent.emit("TileController", this);
    }

    public destroyTile() {
        this._curSprite.spriteFrame = null;
        this._isDestroied = true;
    }

    update(deltaTime: number) {

    }

    move(from: Vec2, to: Vec2) {

    }
}

