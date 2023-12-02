import { Service } from "../services/Service";
import { _decorator } from "cc";
const { ccclass } = _decorator;

@ccclass("EffectsManager")
export class EffectsManager extends Service {

    private _currentTime = 0;

    public get effectIsRunning() {
        return this._currentTime > 0;
    }

    PlayEffect(effectFunc: () => void, execTime: number) {

        this._currentTime = this._currentTime < 0 ?
            execTime :
            this._currentTime + execTime;

        effectFunc();
    }

    protected update(dt: number): void {
        if (this._currentTime > 0) {
            this._currentTime -= dt;
        }
    }
}
