import { _decorator, director } from "cc";
import { Service } from "./Service";
import { LoaderScreen } from "../menu/LoaderScreen";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { Queue } from "../../scripts/Queue";
const { ccclass, property } = _decorator;

@ccclass("SceneLoaderService")
export class SceneLoaderService extends Service {
  loaderScreen: LoaderScreen;

  @property(Boolean)
  persThisNode: boolean = true;

  private _tasksQueue: Queue<() => void> = new Queue<() => void>();

  start() {

    if (this.persThisNode) {
      director.addPersistRootNode(this.node);

      const tmp = this.node?.getComponentInChildren(LoaderScreen);
      if (tmp == null) throw Error("LevelSelector is null");
      this.loaderScreen = tmp;
    }

    director.preloadScene("LvlScene");
    director.preloadScene("scene_game_field");

  }

  loadLevel(levelName: string): void {

    this.loaderScreen.wndIsShowedEvent.off("wndIsShowed");
    this.loaderScreen.wndIsShowedEvent.on("wndIsShowed", () => {

      this._tasksQueue.enqueue(() => {
        director.loadScene(levelName, (e) => {
          if (e) this.loaderScreen.errorTxt.string = e.message;
          this.loaderScreen.hide();
        });
      });

    });

    this.loaderScreen.show();
  }

  loadLevelEventData(event: Event, levelName: string): void {
    this.loadLevel(levelName);
  }

  loadLevelNoScreen(event: Event, levelName: string): void {
    director.getScene()?.children.forEach(n => n.pauseSystemEvents(true));

    director.preloadScene(levelName, () => {
      director.loadScene(levelName);
    });
  }

  loadGameScene(
    sceneName = "mainGameLevel",
    configurate: (config: LevelConfiguration) => void
  ) {

    this.loaderScreen.wndIsShowedEvent.off("wndIsShowed");
    this.loaderScreen.wndIsShowedEvent.on("wndIsShowed", () => {

      this._tasksQueue.enqueue(() => {
        director.loadScene(sceneName, (e, s) => {
          if (e) this.loaderScreen.errorTxt.string = e.message;

          if (configurate != null) {
            const lvlConfig = this.getComponentInChildren(LevelConfiguration);

            if (lvlConfig != null) {
              configurate(lvlConfig);
            }
          }

          this.loaderScreen.hide();
        });
      });

    });

    this.loaderScreen.show();

  }

  protected update(dt: number): void {
    if (!this._tasksQueue.isEmpty) {
      const task = this._tasksQueue.dequeue();
      task();
    }
  }
}
