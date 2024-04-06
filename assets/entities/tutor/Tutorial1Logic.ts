import {
    _decorator,
    animation,
    Button,
    CCBoolean,
    CCInteger
} from 'cc';
import { Service } from '../services/Service';
import { stat } from 'original-fs';
import { GameManager } from '../game/GameManager';
import { FieldController } from '../field/FieldController';
import { LocalizedLabel } from '../../../extensions/i18n/assets/LocalizedLabel';
const { ccclass, property } = _decorator;

@ccclass('Tutorial1Logic')
export class Tutorial1Logic extends Service {
    private _animator: animation.AnimationController | null;
    private _gameManager: GameManager | null;
    private _endTutor = false;

    @property(Button)
    btn: Button;

    @property(animation.AnimationController)
    animators: animation.AnimationController[] = [];

    @property(CCInteger)
    currentTutorialGraphId = 0;

    @property(CCBoolean)
    public get blockButton() {
        return !this.btn.node.active;
    }

    public set blockButton(value: boolean) {
        this.btn.node.active = !value;
    }

    @property(CCBoolean)
    public get skipBotTurn() {
        return this._gameManager ? this._gameManager.needToSkipBotTurn : false
    }

    public set skipBotTurn(val: boolean) {
        if (this._gameManager) this._gameManager.skipBotTurn(val)
    }

    @property(CCBoolean)
    public get endTutor() {
        return this._endTutor;
    }

    public set endTutor(val: boolean) {
        this._endTutor = val;
    }

    start() {
        //this._animator = this.getComponent(animation.AnimationController);
        this._gameManager = this.getService(GameManager);
        const field = this.getService(FieldController);
        field?.tileClickedEvent.on("FieldController", this.tileClicked, this);
        //  if (this._animator) {
        //this._animator = this.animators[this.currentTutorialGraphId];

        //this._animator.enabled = true;
        //   this._animator.
        //}
    }

    public setupGraph() {
        this._animator = this.node.addComponent(animation.AnimationController);
        if (this._animator) {
            this._animator.graph = this.animators[this.currentTutorialGraphId].graph;
            this._animator.__preload();
        }
    }

    tileClicked() {
        this.next();
    }

    next() {
        if (!this._animator) return;

        if (this._endTutor) {
            this.skipBotTurn = false;
            this.node.active = false;
        } else {
            this._animator.setValue("next", true);
        }
    }

}


