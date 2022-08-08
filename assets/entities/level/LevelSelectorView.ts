import { Component, _decorator } from 'cc';
import { ILevelSelectorController } from './ILevelSelectorController';
import { ILevelSelectorView } from './ILevelSelectorView';
import { LevelController } from './LevelController';
import { LevelSelectorController } from './LevelSelectorController';
const { ccclass, property } = _decorator;

@ccclass('LevelSelectorView')
export class LevelSelectorView extends Component implements ILevelSelectorView {
    @property({ type: LevelSelectorController })
    controller: ILevelSelectorController

    public loadLevel(sender: any, levelName: string): void {
        this.controller.loadLevel(levelName);
    }
}
