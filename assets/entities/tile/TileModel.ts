import { _decorator, Component, Node, Vec2, SpriteFrame, CCInteger, CCBoolean, CCString } from 'cc';
import { AdittionalSprite as AdditionalSprite } from './AdittionalSprite';
const { ccclass, property } = _decorator;

/**
 * Represents field model
 */
@ccclass('TileModel')
export class TileModel {

    @property({ type: CCInteger, visible: true })
    Id: number = 0;

    @property({ type: CCString, visible: true })
    Name: string = "";

    @property({ type: SpriteFrame, visible: true })
    Sprite: SpriteFrame = null;

    @property({ type: CCBoolean, visible: true })
    SpecialTile: number = 0;

    @property({ type: AdditionalSprite, visible: true })
    additionalSprites: AdditionalSprite[] = [];

    public findAdditionalSprite(name: string): SpriteFrame { 

        let res=this.additionalSprites.filter(item=>item.name==name);

        if(res.length!=0)
        {
            return res[0].sprite;
        }else{
            return null;
        }
    }
}
