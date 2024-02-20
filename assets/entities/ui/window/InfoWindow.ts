import {
    Sprite,
    _decorator,
    Node,
    assert,
    RichText,
    Label,
    System, Prefab, instantiate, PageView, tween
} from 'cc';
import { Service } from '../../services/Service';
import { SettingsLoader } from '../../services/SettingsLoader';
import { LevelConfiguration } from '../../configuration/LevelConfiguration';
import { OverlayWindow } from '../../menu/OverlayWindow';
import { GameLevelCfgModel } from '../../game/GameLevelCfgModel';
import { LevelSelectorController } from '../../level/LevelSelectorController';
import { PlayerModel } from '../../../models/PlayerModel';
import { BonusModel } from '../../../models/BonusModel';
import { t, init as i18n_init } from '../../../../extensions/i18n/assets/LanguageData';
import { Window } from './Window';
import { preferencesProtocol } from '../../../../extensions/i18n/@types/editor/profile/public/interface';
import { CardInfoPage } from './CardInfoPage';
import { StartLevelWindow } from './StartLevelWindow';
import { PlayerCurrentGameState } from '../../services/PlayerCurrentGameState';

const { ccclass, property } = _decorator;

@ccclass('InfoWindow')
export class InfoWindow extends StartLevelWindow {

    @property(PageView)
    cardInfoPlayerPagesView: PageView;

    private _playerCardModels: BonusModel[];
    private _playerCardSprites: Sprite[] = [];
    private _curState: PlayerCurrentGameState;

    public get isOpened() {
        return this._wnd ? this._wnd.isOpened : false;
    }

    override start(): void {
        super.start();

        this._curState = this._settings.playerCurrentGameState;

        for (let index = 0; index < 3; index++) {
            this.cardInfoPlayerPagesView.addPage(instantiate(this.cardInfoPagePrefab));
        }
    }

    override fillImageData() {
        super.fillImageData();

        const bonuses = this._levelConfig.node
            .getChildByName("BonusModels")
            ?.getComponentsInChildren(BonusModel);

        assert(bonuses != null);

        // this._playerCardSprites.forEach(cs => cs.node.active = false);

        this._playerCardModels = [];

        this._curState.cards.forEach((bc, i) => {
            const bonusModel = bonuses?.find((bm) => bm.mnemonic == bc.mnemonic);

            if (bonusModel) {
                this._playerCardModels.push(bonusModel);
                //   this._playerCardSprites[i].spriteFrame = bonusModel.sprite;
                //  this._playerCardSprites[i].node.active = true;
            }
        });

    }

    showPlayerCardInfoByModel(cardModel: BonusModel) {
        for (let i = 0; i < this._playerCardModels.length; i++) {
            const thisModel = this._playerCardModels[i];

            if (thisModel.mnemonic == cardModel.mnemonic) {
                this.showPlayerCardInfo((i + 1).toString());

                break;
            }
        }
    }

    showPlayerCardInfo(cardNumber: string) {

        this.cardInfoPlayerPagesView.removeAllPages();

        for (let i = 0; i < this._playerCardModels.length; i++) {
            const cardModel = this._playerCardModels[i];

            const page = instantiate(this.cardInfoPagePrefab);
            const cardPage = page.getComponent(CardInfoPage);

            if (cardPage) {
                cardPage.node.active = true;
                cardPage.setInfo(cardModel);

                this.cardInfoPlayerPagesView.addPage(page);
            }
        }

        this._wnd?.showContentGroup("cardPlayer");

        tween(this).delay(0.1).call(() => {
            this.cardInfoPlayerPagesView.setCurrentPageIndex(Number(cardNumber) - 1);
        }).start();
    }
}
