import { _decorator, director } from "cc";
import { Service } from "./Service";
import { LoaderScreen } from "../menu/LoaderScreen";
import { LevelConfiguration } from "../configuration/LevelConfiguration";
const { ccclass, property } = _decorator;

@ccclass("SceneLoaderService")
export class SceneLoaderService extends Service {
  loaderScreen: LoaderScreen;

  start() {
    director.addPersistRootNode(this.node);

    const tmp = this.node?.getComponentInChildren(LoaderScreen);
    if (tmp == null) throw Error("LevelSelector is null");
    this.loaderScreen = tmp;
  }

  loadLevel(levelName: string): void {
    director.loadScene(levelName);
  }

  loadGameScene(
    sceneName = "mainGameLevel",
    configurate: (config: LevelConfiguration) => void
  ) {
    this.loaderScreen.show();
    director.preloadScene("scene_dev_nt", () => {
      director.loadScene("scene_dev_nt", () => {
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
