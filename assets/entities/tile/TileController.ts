import {
    _decorator,
    Component,
    Sprite,
    SpriteFrame,
    log,
    EventTarget,
    Button,
    Vec3,
    CCFloat
} from 'cc';
import { FieldController } from '../field/FieldController';
import { TileModel } from './TileModel';
import { TileState } from './TileState';
const { ccclass, property } = _decorator;

@ccclass('TileController')
export class TileController extends Component {

    private _curSprite: Sprite;
    private _field: FieldController;
    private _button: Button;
    private _needMove: boolean = false;
    private _from: Vec3;
    private _to: Vec3;
    private _speed: number;

    public clickedEvent: EventTarget = new EventTarget();

    /**Tile model */
    @property(TileModel)
    tileModel: TileModel;

    /** Speed */
    @property(CCFloat)
    Speed: number = 1;

    /** Speed */
    @property(CCFloat)
    Acceleration: number = 0.1;

    public tileAnalized: boolean;

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
        if (this._needMove) {
            let dir: Vec3 = new Vec3();
            Vec3.subtract(dir, this._to, this._from)
            dir.normalize();

            this._speed += this.Acceleration * deltaTime;

            if (this._speed > this.Speed) {
                this._speed = this.Speed
            }

            let speed3D: Vec3 = new Vec3();
            let pos: Vec3 = new Vec3();
            let dir2: Vec3 = new Vec3();

            Vec3.multiplyScalar(speed3D, dir, this._speed * deltaTime);
            Vec3.add(pos, this.node.position, speed3D);
            Vec3.subtract(dir2, this._to, pos)
            dir2.normalize();

            if (!dir.equals(dir2)) {
                this._needMove = false;
                pos = this._to;
            }

            this.node.position = pos;
        }
    }

    move(from: Vec3, to: Vec3) {
        this._from = from;
        this._to = to;
        this._speed = 0;
        if (!this._to.equals(this._from)) this._needMove = true;
    }
}

