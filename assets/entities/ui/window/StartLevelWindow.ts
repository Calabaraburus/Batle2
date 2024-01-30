import { Sprite, _decorator, Node, assert, RichText, Label } from 'cc';
import { Service } from '../../services/Service';
import { SettingsLoader } from '../../services/SettingsLoader';
import { LevelConfiguration } from '../../configuration/LevelConfiguration';
import { OverlayWindow } from '../../menu/OverlayWindow';
import { GameLevelCfgModel } from '../../game/GameLevelCfgModel';
import { LevelSelectorController } from '../../level/LevelSelectorController';
import { PlayerModel } from '../../../models/PlayerModel';
import { BonusModel } from '../../../models/BonusModel';
import { t, init as i18n_init } from '../../../../extensions/i18n/assets/LanguageData';


//import L from '../../../localization/i18n-node';

const { ccclass, property } = _decorator;

@ccclass('StartLevelWindow')
export class StartLevelWindow extends Service {

    @property(Sprite)
    HeroImage: Sprite;

    @property(Sprite)
    card1: Sprite;

    @property(Sprite)
    card2: Sprite;

    @property(Sprite)
    card3: Sprite;

    @property(RichText)
    scenarioTextField: RichText;

    @property(Label)
    levelNumberLabel: Label;

    @property(Label)
    levelNameLabel: Label;


    private _levelName: string;
    private _wnd: OverlayWindow | null;
    private _settings: SettingsLoader;
    private _levelConfigModel: GameLevelCfgModel;
    private _levelConfig: LevelConfiguration;
    private _cardSprites: Sprite[] = [];
    private _levelSelector: LevelSelectorController;

    start(): void {
        this._settings = this.getServiceOrThrow(SettingsLoader);
        this._levelConfig = this.getServiceOrThrow(LevelConfiguration);
        this._wnd = this.getComponent(OverlayWindow);
        this._levelSelector = this.getServiceOrThrow(LevelSelectorController);

        this._cardSprites.push(this.card1);
        this._cardSprites.push(this.card2);
        this._cardSprites.push(this.card3);
    }

    showWindow(sender: any, lvlName: string) {

        this._levelName = lvlName;
        this._wnd?.showWindow();
        const tcfg = this._settings.gameConfiguration.levels.find(lvl => lvl.lvlName == lvlName);
        assert(tcfg != null);

        this._levelConfigModel = tcfg;

        this.fillImageData();
        this.fillStrings();
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

        this._cardSprites.forEach(cs => cs.node.active = false);

        this._levelConfigModel.botCards.forEach((bc, i) => {
            const bonusModel = bonuses?.find((bm) => bm.mnemonic == bc.mnemonic);

            if (bonusModel) {
                this._cardSprites[i].spriteFrame = bonusModel.sprite;
                this._cardSprites[i].node.active = true;
            }
        });
    }

    fillStrings() {
        i18n_init('ru');

        this.scenarioTextField.string = t(`levels.${this._levelName}.intro`);
        this.levelNameLabel.string = t(`levels.${this._levelName}.name`);
        this.levelNumberLabel.string = t(`levels.${this._levelName}.num`);
    }

    hideWindow() {
        this._wnd?.hideWindow();

    }

    loadLevel() {
        this._levelSelector.loadLevel(this, this._levelName);
    }
}
