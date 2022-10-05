//  service.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras
import { Component, _decorator, js, __private, director } from "cc";
const { ccclass } = _decorator;

@ccclass("Service")
export class Service extends Component {
  private _type = js.getClassName(this);

  public get serviceType() {
    return this._type;
  }

  getService<T extends Component>(
    classConstructor:
      | __private._types_globals__Constructor<T>
      | __private._types_globals__AbstractedConstructor<T>
  ): T | null {
    const scene = director.getScene();
    if (scene == null) return null;
    return scene.getComponentInChildren(classConstructor);
  }

  getServices<T extends Component>(
    classConstructor:
      | __private._types_globals__Constructor<T>
      | __private._types_globals__AbstractedConstructor<T>
  ): T[] {
    const scene = director.getScene();
    if (scene == null) return [];
    return scene.getComponentsInChildren(classConstructor);
  }
}
