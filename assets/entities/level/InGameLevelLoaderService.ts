import {
    Component,
    director,
    _decorator,
    randomRangeInt,
    random,
    AudioSource,
    LineComponent,
    assert,
    resources,
    TextAsset,
} from "cc";
import { Service } from "../services/Service";
import { SceneLoaderService } from "../services/SceneLoaderService";
import { GameManager } from "../game/GameManager";
import { LevelSelectorController } from "./LevelSelectorController";
import { Queue } from "../../scripts/Queue";
const { ccclass, property } = _decorator;

@ccclass("InGameLevelLoaderService")
export class InGameLevelLoaderService extends Service {
    private _sceneLoader: SceneLoaderService;
    private _gameManager: GameManager | null;
    private _lvlSelector: LevelSelectorController;
    private _task: (() => void) | null = null;

    start() {
        this._sceneLoader = this.getServiceOrThrow(SceneLoaderService);
        this._gameManager = this.getService(GameManager);
        this._lvlSelector = this.getServiceOrThrow(LevelSelectorController);
        this._task = null;
    }


    loadLevel(sender: object, levelName: string): void {
        this._sceneLoader.showLoaderScreen();

        this.runTask(
            () => {
                if (this._sceneLoader == null) throw Error("SceneLoader is null");
                const cfgAction = this._lvlSelector.getCfgByLvlName(levelName);

                if (cfgAction == null)
                    throw Error("No configuration for " + levelName + " level");
                this._sceneLoader.loadGameScene("scene_game_field", cfgAction);
            }
        );
    }

    loadScene(sender: object, sceneName: string): void {
        this._sceneLoader.showLoaderScreen();

        this.runTask(
            () => {
                this._sceneLoader.loadLevel(sceneName);
            }
        );
    }

    runTask(task: () => void) {

        if (this._gameManager == null) {
            task();
        } else {
            this._gameManager.stop();

            if (this._task == null) {
                this._task = task;
            } else {
                throw new Error("Task already exists");
            }
        }
    }

    update(dt: number): void {
        if (this._task != null && !this._gameManager?.isStarted) {
            this._task();
            this._task = null;
        }
    }
}
