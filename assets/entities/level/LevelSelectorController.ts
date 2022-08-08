import { Component, director, _decorator } from 'cc';
import { ILevelSelectorController } from './ILevelSelectorController';
import { ILevelSelectorView } from './ILevelSelectorView';
const { ccclass, property } = _decorator;

@ccclass('LevelSelectorController')
export class LevelSelectorController
    extends Component
    implements ILevelSelectorController {

    loadLevel(levelName: string): void {
        director.loadScene(levelName);
    }
}
