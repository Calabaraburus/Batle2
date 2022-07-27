import { CCString, _decorator, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AdittionalSprite')
export class AdittionalSprite {
    @property({ type: CCString })
    name: string;

    @property({ type: SpriteFrame })
    sprite: SpriteFrame;
}
