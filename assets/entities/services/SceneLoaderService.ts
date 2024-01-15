import { AudioSource, _decorator, director } from "cc";
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
    director.loadScene(levelName);
  }

  loadLevelEventData(event: Event, levelName: string): void {
    director.loadScene(levelName);
  }

  loadGameScene(
    sceneName = "mainGameLevel",
    configurate: (config: LevelConfiguration) => void
  ) {
    this.loaderScreen.show();
    director.preloadScene(sceneName, () => {
      director.loadScene(sceneName, () => {
        if (configurate != null) {
          const lvlConfig = director
            .getScene()
            ?.getChildByName("LevelConfiguration")
            ?.getComponent(LevelConfiguration);

          if (lvlConfig != null) {
            configurate(lvlConfig);
          }
        }

        this.loaderScreen.hide();
      });
    });
  }
}
