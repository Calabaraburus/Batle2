import { Service } from '../../services/Service';
import { BonusModel } from '../../../models/BonusModel';
import { Sprite, _decorator, Node, assert, RichText, Label, System } from 'cc';
import { t } from '../../../../extensions/i18n/assets/LanguageData';

const { ccclass, property } = _decorator;

@ccclass('CardInfoPage')
export class CardInfoPage extends Service {


    @property(Sprite)
    cardImage: Sprite;

    @property(Label)
    cardName: Label;

    @property(RichText)
    cardDescription: RichText;


    public setInfo(cardModel: BonusModel) {
        this.cardImage.spriteFrame = cardModel.sprite;
        this.cardName.string = t(`cards.${cardModel.mnemonic}.name`);
        this.cardDescription.string = t(`cards.${cardModel.mnemonic}.description`);
    }

}
