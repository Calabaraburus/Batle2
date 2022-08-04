import {
    _decorator,
    Sprite,
    SpriteFrame,
    log,
    EventTarget,
    Button,
    Vec3,
    CCFloat,
    randomRangeInt,
    UITransform,
    math,
    Node
} from 'cc';
import { TileController } from '../TileController';
import { TileModel } from '../../../models/TileModel';
import { TileStateToColor } from '../TileStateToColor';
const { ccclass, property } = _decorator;

@ccclass('StarTileController')
export class StarTileController extends TileController {

    private _modelCF: TileModel;

    /** Sprite with texture */
    @property(Sprite)
    starSprite: Sprite;

    get modelCreatedFrom(): TileModel {
        return this._modelCF;
    }

    public createdForm(model: TileModel) {
        this._modelCF = model;
        this.starSprite.color = model.starColor;
    }

    public destroyTile() {
        super.destroyTile()
        this.starSprite.spriteFrame = null;
    }
}

