import { CCString, _decorator, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AdittionalSprite')
export class AdittionalSprite {

    @property({})
    name: string = "Name";

    @property({ type: SpriteFrame })
    sprite: SpriteFrame = null;

    constructor() { }
}

