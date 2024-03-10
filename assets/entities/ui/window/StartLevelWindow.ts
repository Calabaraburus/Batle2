import {
    Sprite,
    _decorator,
    Node,
    assert,
    RichText,
    Label,
    System, Prefab, instantiate, PageView, tween, SpriteFrame
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
import { CardStrtLVLWnd } from './CardStrtLVLWnd';

const { ccclass, property } = _decorator;

@ccclass('StartLevelWindow')
export class StartLevelWindow extends Service {

    @property(Sprite)
    HeroImage: Sprite;

    @property(CardStrtLVLWnd)
    card_1: CardStrtLVLWnd;

    @property(CardStrtLVLWnd)
    card_2: CardStrtLVLWnd;

    @property(CardStrtLVLWnd)
    card_3: CardStrtLVLWnd;

    @property(RichText)
    scenarioTextField: RichText;

    @property(Label)
    levelNumberLabel: Label;

    @property(Label)
    levelNameLabel: Label;

    @property(PageView)
    cardInfoPagesView: PageView

    @property(Prefab)
    cardInfoPagePrefab: Prefab;

    @property(SpriteFrame)
    crystalSprites: SpriteFrame[] = [];

    protected _levelName: string;
    private _wndOverlay: OverlayWindow | null;
    protected _wnd: Window | null;
    protected _settings: SettingsLoader;
    protected _levelConfigModel: GameLevelCfgModel;
    protected _levelConfig: LevelConfiguration
    private _cardSprites: CardStrtLVLWnd[] = [];
    private _levelSelector: LevelSelectorController;
    private _botCardModels: BonusModel[];
    private _isInit = false;

    start(): void {
        this._settings = this.getServiceOrThrow(SettingsLoader);
        this._levelConfig = this.getServiceOrThrow(LevelConfiguration);
        this._wndOverlay = this.getComponent(OverlayWindow);
        this._wnd = this.getComponent(Window);
        const tmpSelector = this.getService(LevelSelectorController);

        if (tmpSelector) {
            this._levelSelector = tmpSelector;
        }

        this._cardSprites.push(this.card_1);
        this._cardSprites.push(this.card_2);
        this._cardSprites.push(this.card_3);

        for (let index = 0; index < 3; index++) {
            this.cardInfoPagesView.addPage(instantiate(this.cardInfoPagePrefab));
        }
    }

    showWindow(sender: any, lvlName: string = "") {
        if (this._isInit == false) {
            this._isInit = true;
            this.start();
            this._wnd?.start();
        }


        this._wndOverlay?.showWindow();

        if (lvlName != "") {
            this._levelName = lvlName;
            const tcfg = this._settings.gameConfiguration.levels.find(lvl => lvl.lvlName == lvlName);
            assert(tcfg != null);

            this._levelConfigModel = tcfg;

            this.fillImageData();
            this.fillStrings();

            this._wnd?.showContentGroup("default");
        }
    }

    fillImageData() {
        const player = this._levelConfig.node
            .getChildByName("HeroModels")!
            .getChildByName(LevelSelectorController.titleCaseWord(this._levelConfigModel.botHeroName) + "Hero")
            ?.getComponent(PlayerModel);

        assert(player != null);

        const bonuses = this._levelConfig.node
            .getChildByName("BonusModels")
            ?.getComponentsInChildren(BonusModel);

        assert(bonuses != null);

        this.HeroImage.spriteFrame = player?.heroImage;

        this._cardSprites.forEach(cs => cs.card.node.active = false);

        this._botCardModels = []

        this._levelConfigModel.botCards.forEach((bc, i) => {
            const bonusModel = bonuses?.find((bm) => bm.mnemonic == bc.mnemonic);

            if (bonusModel) {
                this._botCardModels.push(bonusModel);
                this._cardSprites[i].card.spriteFrame = bonusModel.sprite;
                this._cardSprites[i].card.node.active = true;
                this.updateLevelSprite(bonusModel, this._cardSprites[i].lvlIco);
            }
        });
    }

    fillStrings() {
        const lng = navigator.language;
        const win: any = window;
        const l = win.languages;
        //    i18n_init('ru');

        this.scenarioTextField.string = t(`levels.${this._levelName}.intro`);
        this.levelNameLabel.string = t(`levels.${this._levelName}.name`);
        this.levelNumberLabel.string = t(`levels.${this._levelName}.num`);
    }

    hideWindow() {
        this._wndOverlay?.hideWindow();
    }

    updateLevelSprite(model: BonusModel, sprite: Sprite) {
        switch (model.bonusLevel) {
            case 0:
                sprite.spriteFrame = null;
                break;
            case 1:
                sprite.spriteFrame = this.crystalSprites[0];
                break;
            case 2:
                sprite.spriteFrame = this.crystalSprites[1];
                break;
        }
    }

    showCardInfo(sender: any, cardNumber: string) {

        this.cardInfoPagesView.removeAllPages();

        for (let i = 0; i < this._botCardModels.length; i++) {
            const cardModel = this._botCardModels[i];

            const page = instantiate(this.cardInfoPagePrefab)
            const cardPage = page.getComponent(CardInfoPage);

            if (cardPage) {
                cardPage.node.active = true;
                cardPage.setInfo(cardModel);

                this.cardInfoPagesView.addPage(page);
            }
        }

        this._wnd?.showContentGroup("card");

        tween(this).delay(0.1).call(() => {
            this.cardInfoPagesView.setCurrentPageIndex(Number(cardNumber) - 1);
        }).start();
    }

    showCardInfoByModel(sender: any, cardModel: BonusModel) {

        this.cardInfoPagesView.removeAllPages();

        const page = instantiate(this.cardInfoPagePrefab)
        const cardPage = page.getComponent(CardInfoPage);

        if (cardPage) {
            cardPage.node.active = true;
            cardPage.setInfo(cardModel);

            this.cardInfoPagesView.addPage(page);
        }

        this._wnd?.showContentGroup("card");

    }

    hideCardInfo() {
        this._wnd?.showContentGroup("default");
    }

    loadLevel() {
        this._levelSelector.loadLevel(this, this._levelName);
    }

    loadCustomLevel(e: any, lvlName: string) {
        this.getService(LevelSelectorController)?.loadScene(this, lvlName);
    }

}

