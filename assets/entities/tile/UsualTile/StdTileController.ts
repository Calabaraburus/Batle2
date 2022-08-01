import {
    _decorator,
    Component,
    Sprite,
    SpriteFrame,
    log,
    EventTarget,
    Button,
    Vec3,
    CCFloat,
    ParticleSystem2D,
    instantiate,
    ParticleSystem,
    Node,
    Prefab,
    UITransform
} from 'cc';
import { TileController } from '../TileController';
import { TileModel } from '../TileModel';
import { TileState } from '../TileState';
const { ccclass, property } = _decorator;

@ccclass('StdTileController')
export class StdTileController extends TileController {

    private _curSprite: Sprite;
    private _state: TileState;
    private _bombSprite: SpriteFrame;
    private _rocketSprite: SpriteFrame;
    private _starSprite: SpriteFrame;

    /** Special sprite */
    @property(Sprite)
    SpecialSprite: Sprite;

    /** Destroy particle system */
    @property(Prefab)
    destroyPartycles: Prefab;


    start() {
        super.start();
        this.updateSprite();
    }

    updateSprite() {
        this._curSprite = this.getComponent(Sprite);
        this._curSprite.spriteFrame = this.tileModel.Sprite;
    }

    public get state(): TileState {
        return this._state;
    }

    public setBomb() {
        this.SpecialSprite.spriteFrame = this._bombSprite;
        this._state = TileState.bomb;
    }

    public setRocket() {
        this.SpecialSprite.spriteFrame = this._rocketSprite;
        this._state = TileState.rocket;
    }

    public setStar() {
        this.SpecialSprite.spriteFrame = this._starSprite;
        this._state = TileState.star;
    }

    public resetSpecialSprite() {
        this.SpecialSprite.spriteFrame = null;
        this._state = TileState.empty;
    }

    public setTile(tileModel: TileModel) {
        super.setTile(tileModel);
        this._rocketSprite = tileModel.findAdditionalSprite("rocket");
        this._bombSprite = tileModel.findAdditionalSprite("bomb");
        this._starSprite = tileModel.findAdditionalSprite("star");
    }

    public destroyTile() {
        super.destroyTile();

        this._curSprite = this.getComponent(Sprite);
        this._curSprite.spriteFrame = null;
        this.CreateParticles();
        this.resetSpecialSprite();
    }

    private CreateParticles() {
        const ps = instantiate(this.destroyPartycles)//.getComponent(ParticleSystem2D);
        ps.parent = this.node.parent
        const ui = this.getComponent(UITransform);
        ps.position = new Vec3(this.node.position.x + ui.contentSize.width / 2,
            this.node.position.y + ui.contentSize.height / 2,
            this.node.position.z);
    }
}
