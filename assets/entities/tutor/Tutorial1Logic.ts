import { _decorator, animation, Animation, AnimationComponent, Button, CCBoolean, Component, Label, Node, Widget } from 'cc';
import { Service } from '../services/Service';
import { stat } from 'original-fs';
const { ccclass, property } = _decorator;

@ccclass('Tutorial1Logic')
export class Tutorial1Logic extends Service {
    private _animator: animation.AnimationController | null;
    private _blockButton = false;

    @property(Button)
    btn: Button;

    @property(CCBoolean)
    public get blockButton() {
        return this._blockButton;
    }

    public set blockButton(value: boolean) {
        this.btn.node.active = !value;
    }

    start() {
        this._animator = this.getComponent(animation.AnimationController);
    }

    next() {
        if (!this._animator) return;

        this._animator.setValue("next", true);
    }

}


