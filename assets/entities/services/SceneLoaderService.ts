import { AudioSource, BlockInputEvents, _decorator, director, input, tween } from "cc";
import { Service } from "./Service";
import { LoaderScreen } from "../menu/LoaderScreen";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
import { AudioManagerService } from "../../soundsPlayer/AudioManagerService";
const { ccclass, property } = _decorator;

@ccclass("SceneLoaderService")
export class SceneLoaderService extends Service {
  loaderScreen: LoaderScreen;

  @property(Boolean)
  persThisNode: boolean = true;

  start() {

    //this.getService(SceneLoaderService);
    if (this.persThisNode) {
      director.addPersistRootNode(this.node);

      const tmp = this.node?.getComponentInChildren(LoaderScreen);
      if (tmp == null) throw Error("LevelSelector is null");
      this.loaderScreen = tmp;

    }

  }

  loadLevel(levelName: string): void {
    director.getScene()?.children.forEach(n => n.pauseSystemEvents(true));

    this.loaderScreen.wndIsShowedEvent.off("wndIsShowed");
    this.loaderScreen.wndIsShowedEvent.on("wndIsShowed", () => {

      director.preloadScene(levelName, () => {
        director.loadScene(levelName, () => {
          this.loaderScreen.hide();
        });
      });

    });

    this.loaderScreen.show();
  }

  loadLevelEventData(event: Event, levelName: string): void {
    this.loadLevel(levelName);
  }

  loadGameScene(
    sceneName = "mainGameLevel",
    configurate: (config: LevelConfiguration) => void
  ) {
    director.getScene()?.children.forEach(n => n.pauseSystemEvents(true));

    this.loaderScreen.wndIsShowedEvent.off("wndIsShowed");
    this.loaderScreen.wndIsShowedEvent.on("wndIsShowed", () => {
      director.preloadScene(sceneName, () => {
        director.loadScene(sceneName, (e, s) => {
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
}
