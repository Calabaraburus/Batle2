import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { Service } from '../../services/Service';
const { ccclass, property } = _decorator;

@ccclass('Window')
export class Window extends Service {

    private _origPos: Vec3;

    private set origPos(value: Vec3) {
        this._origPos = value;
    }

    private get origPos() {
        return this._origPos;
    }

    start() {
        this.origPos = this.node.position.clone();
    }

    public showWindow() {
        this.node.active = true;

        tween(this.node)
            .to(0.4, { position: new Vec3(0, 0, 0) }, { easing: "backInOut" })
            .start();
    }

    public hideWindow() {

        tween(this.node)
            .to(0.4, { position: this.origPos }, { easing: "backOut" })
            .call(() => {
                this.node.active = false;
            })
            .start();

    }
}


