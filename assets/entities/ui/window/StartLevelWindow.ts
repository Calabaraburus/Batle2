import { Sprite, _decorator, Node, assert } from 'cc';
import { Service } from '../../services/Service';
import { SettingsLoader } from '../../services/SettingsLoader';
import { LevelConfiguration } from '../../configuration/LevelConfiguration';
import { OverlayWindow } from '../../menu/OverlayWindow';
import { GameLevelCfgModel } from '../../game/GameLevelCfgModel';
import { LevelSelectorController } from '../../level/LevelSelectorController';
import { PlayerModel } from '../../../models/PlayerModel';
import { BonusModel } from '../../../models/BonusModel';
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

    private _levelName: string;
    private _wnd: OverlayWindow | null;
    private _settings: SettingsLoader;
    private _levelConfigModel: GameLevelCfgModel;
    private _levelConfig: LevelConfiguration;
    private _cardSprites: Sprite[] = [];

    start(): void {
        this._settings = this.getServiceOrThrow(SettingsLoader);
        this._levelConfig = this.getServiceOrThrow(LevelConfiguration);
        this._wnd = this.getComponent(OverlayWindow);

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


    hideWindow() {
        this._wnd?.hideWindow();
    }
}
