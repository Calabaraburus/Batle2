import { _decorator, assert, CCFloat, Component, director, math, Node, UIOpacity } from 'cc';
import { ObjectsCache } from '../../../ObjectsCache/ObjectsCache';
import { loseLifeLabel } from './loseLifeLabel';
import { Service } from '../../services/Service';
import { EffectsManager } from '../../game/EffectsManager';
const { ccclass, property } = _decorator;

@ccclass('LoseLifeEffect')
export class LoseLifeEffect extends Service {
    private _opacity: UIOpacity;
    @property(CCFloat)
    effectSpeed: number = 4;
    private _effectsManager: EffectsManager;

    protected start(): void {
        const t = this.node.getComponent(UIOpacity);
        this._effectsManager = this.getServiceOrThrow(EffectsManager);

        assert(t != null);

        this._opacity = t;
        this._opacity.opacity = 0;
    }

    playEffect(life: number) {
        if (ObjectsCache.instance) {
            this._effectsManager.PlayEffectNow(() => { }, 0.8);

            const label = ObjectsCache.instance.getObject(loseLifeLabel);
            if (label) {
                label.node.parent = null;
                label.node.parent = director.getScene()?.getChildByName("LevelView")!;
            }
            const pos = this.node.worldPosition.clone();
            pos.x += math.randomRange(-50, 50);
            pos.y += math.randomRange(-50, 50);
            label?.play(life, pos);
            this._opacity.opacity = 255;
        }
    }

    protected update(dt: number): void {
        if (this._opacity.opacity > 0) {
            this._opacity.opacity -= this.effectSpeed;
        }
    }
}


